import { useCallback, useEffect, useMemo, useRef } from "react";
import type { VsCodeApi } from "../vscode";
import type {
  ExtensionMessage,
  WebviewState,
  Tool,
  Attachment,
} from "../types";
import { useChatStore } from "../store";

// Throttle interval for streaming updates (ms)
const STREAM_THROTTLE_MS = 50;
const TOOL_THROTTLE_MS = 100;

// Acquire VS Code API once at module level
let vsCodeApi: VsCodeApi | null = null;

function getVsCodeApi(): VsCodeApi {
  if (!vsCodeApi) {
    if (typeof acquireVsCodeApi === "undefined") {
      // Mock for development outside VS Code
      console.warn("[VSCode ACP] Running outside VS Code - using mock API");
      vsCodeApi = {
        postMessage: (msg: unknown) => console.log("[Mock] postMessage:", msg),
        getState: <T>() => undefined as T | undefined,
        setState: <T>(state: T) => state,
      };
    } else {
      vsCodeApi = acquireVsCodeApi();
      console.log("[VSCode ACP] VS Code API acquired successfully");
    }
  }
  return vsCodeApi;
}

// Initialize immediately
const vscode = getVsCodeApi();

// Export a function to initialize message handling
// This should be called once from App component
export function useVsCodeInit() {
  const connectionState = useChatStore((state) => state.connectionState);
  const inputValue = useChatStore((state) => state.inputValue);
  const messages = useChatStore((state) => state.messages);
  const currentSessionId = useChatStore((state) => state.currentSessionId);
  const selectedAgentId = useChatStore((state) => state.selectedAgentId);

  // Stream chunk buffer for throttling
  const streamBufferRef = useRef<string>("");
  const streamTimeoutRef = useRef<number | null>(null);

  // Thinking chunk buffer for throttling
  const thinkingBufferRef = useRef<string>("");
  const thinkingTimeoutRef = useRef<number | null>(null);

  // Tool updates buffer for batching
  const toolUpdatesRef = useRef<Map<string, Tool>>(new Map());
  const toolTimeoutRef = useRef<number | null>(null);

  // Debug: message counter
  const messageCountRef = useRef(0);

  // Get store actions directly from getState - they are stable
  const getActions = useCallback(() => useChatStore.getState(), []);

  const postMessage = useCallback((message: unknown) => {
    console.log("[VSCode ACP] Sending message:", message);
    vscode.postMessage(message);
  }, []);

  const saveState = useCallback(() => {
    const state: WebviewState = {
      isConnected: connectionState === "connected",
      inputValue: inputValue,
    };
    vscode.setState(state);
  }, [connectionState, inputValue]);

  const restoreState = useCallback(() => {
    const state = vscode.getState<WebviewState>();
    if (state) {
      if (state.inputValue) {
        getActions().setInputValue(state.inputValue);
      }
    }
  }, [getActions]);

  // Handle incoming messages from extension
  useEffect(() => {
    const handleMessage = (event: MessageEvent<ExtensionMessage>) => {
      const msg = event.data;
      messageCountRef.current++;
      console.log(`[DEBUG] Message #${messageCountRef.current}: ${msg.type}`);
      const actions = getActions();

      switch (msg.type) {
        case "userMessage":
          if (msg.text || msg.attachments?.length) {
            actions.addMessage({
              type: "user",
              text: msg.text || "",
              attachments: msg.attachments,
            });
            actions.setIsThinking(true);
          }
          break;

        case "streamStart":
          actions.startStreaming();
          break;

        case "streamChunk":
          if (msg.text) {
            // Buffer stream chunks and flush at throttled intervals
            streamBufferRef.current += msg.text;
            if (!streamTimeoutRef.current) {
              streamTimeoutRef.current = window.setTimeout(() => {
                if (streamBufferRef.current) {
                  console.log(
                    `[DEBUG] Flushing streamChunk: ${streamBufferRef.current.length} chars`
                  );
                  actions.appendStreamChunk(streamBufferRef.current);
                  streamBufferRef.current = "";
                }
                streamTimeoutRef.current = null;
              }, STREAM_THROTTLE_MS);
            }
          }
          break;

        case "thinkingChunk":
          if (msg.text) {
            // Buffer thinking chunks and flush at throttled intervals
            thinkingBufferRef.current += msg.text;
            console.log(
              `[DEBUG] thinkingChunk received: +${msg.text.length} chars, buffer: ${thinkingBufferRef.current.length} chars`
            );
            if (!thinkingTimeoutRef.current) {
              console.log(
                `[DEBUG] Starting throttle timer (${THINKING_THROTTLE_MS}ms)`
              );
              thinkingTimeoutRef.current = window.setTimeout(() => {
                const bufferLen = thinkingBufferRef.current.length;
                if (thinkingBufferRef.current) {
                  console.log(`[DEBUG] Flushing buffer: ${bufferLen} chars`);
                  actions.appendThinkingChunk(thinkingBufferRef.current);
                  thinkingBufferRef.current = "";
                }
                thinkingTimeoutRef.current = null;
              }, THINKING_THROTTLE_MS);
            }
          }
          break;

        case "streamEnd":
          // Flush any remaining buffered stream text
          if (streamTimeoutRef.current) {
            clearTimeout(streamTimeoutRef.current);
            streamTimeoutRef.current = null;
          }
          if (streamBufferRef.current) {
            actions.appendStreamChunk(streamBufferRef.current);
            streamBufferRef.current = "";
          }
          // Flush any remaining buffered thinking text
          if (thinkingTimeoutRef.current) {
            clearTimeout(thinkingTimeoutRef.current);
            thinkingTimeoutRef.current = null;
          }
          if (thinkingBufferRef.current) {
            actions.appendThinkingChunk(thinkingBufferRef.current);
            thinkingBufferRef.current = "";
          }
          // Flush any pending tool updates
          if (toolTimeoutRef.current) {
            clearTimeout(toolTimeoutRef.current);
            toolTimeoutRef.current = null;
          }
          if (toolUpdatesRef.current.size > 0) {
            actions.batchUpdateTools(toolUpdatesRef.current);
            toolUpdatesRef.current = new Map();
          }
          actions.clearThinking(); // Thinking 초기화
          actions.endStreaming(msg.html);
          break;

        case "toolCallStart":
          if (msg.toolCallId && msg.name) {
            const tool: Tool = {
              name: msg.name,
              input: null,
              output: null,
              status: "running",
              kind: msg.kind,
            };

            // For Task tools, try to extract agent type from rawInput
            if (msg.name === "Task" && msg.rawInput) {
              if (msg.rawInput.subagent_type) {
                tool.agentType = msg.rawInput.subagent_type;
              }
              if (msg.rawInput.description) {
                tool.description = msg.rawInput.description;
              }
            }

            // Batch tool updates
            toolUpdatesRef.current.set(msg.toolCallId, tool);
            if (!toolTimeoutRef.current) {
              toolTimeoutRef.current = window.setTimeout(() => {
                if (toolUpdatesRef.current.size > 0) {
                  console.log(
                    `[DEBUG] Flushing ${toolUpdatesRef.current.size} tool updates`
                  );
                  actions.batchUpdateTools(toolUpdatesRef.current);
                  toolUpdatesRef.current = new Map();
                }
                toolTimeoutRef.current = null;
              }, TOOL_THROTTLE_MS);
            }
          }
          break;

        case "toolCallComplete":
          if (msg.toolCallId) {
            const output =
              msg.content?.[0]?.content?.text || msg.rawOutput?.output || "";
            const input =
              msg.rawInput?.command || msg.rawInput?.description || "";

            // Check buffer first, then store for existing tool data
            const bufferedTool = toolUpdatesRef.current.get(msg.toolCallId);
            const storeTool = actions.streaming?.tools?.[msg.toolCallId];
            const existingTool = bufferedTool || storeTool;

            const updatedTool: Tool = {
              name: msg.title || existingTool?.name || "Unknown",
              kind: msg.kind || existingTool?.kind,
              input: input || existingTool?.input || null,
              output: output || existingTool?.output || null,
              status: (msg.status as Tool["status"]) || "completed",
              // Preserve Task-specific fields
              agentType: existingTool?.agentType,
              description: existingTool?.description,
            };

            // For Task tools, try to extract agent type from rawInput if not already set
            if (
              (msg.name === "Task" || msg.title === "Task") &&
              msg.rawInput &&
              !updatedTool.agentType
            ) {
              if (msg.rawInput.subagent_type) {
                updatedTool.agentType = msg.rawInput.subagent_type;
              }
              if (msg.rawInput.description && !updatedTool.description) {
                updatedTool.description = msg.rawInput.description;
              }
            }

            toolUpdatesRef.current.set(msg.toolCallId, updatedTool);

            if (!toolTimeoutRef.current) {
              toolTimeoutRef.current = window.setTimeout(() => {
                if (toolUpdatesRef.current.size > 0) {
                  console.log(
                    `[DEBUG] Flushing ${toolUpdatesRef.current.size} tool updates`
                  );
                  actions.batchUpdateTools(toolUpdatesRef.current);
                  toolUpdatesRef.current = new Map();
                }
                toolTimeoutRef.current = null;
              }, TOOL_THROTTLE_MS);
            }
          }
          break;

        case "error":
          actions.setIsThinking(false);
          if (msg.text) {
            actions.addMessage({ type: "error", text: msg.text });
          }
          break;

        case "agentError":
          if (msg.text) {
            actions.addMessage({ type: "error", text: msg.text });
          }
          break;

        case "connectionState":
          if (msg.state) {
            actions.setConnectionState(
              msg.state as "disconnected" | "connecting" | "connected" | "error"
            );
          }
          break;

        case "agents":
          if (msg.agents) {
            actions.setAgents(msg.agents, msg.selected);
          }
          break;

        case "agentChanged":
          if (msg.agentId) {
            actions.setSelectedAgent(msg.agentId);
          }
          // Clear messages but add a system message so welcome view doesn't show
          actions.clearMessages();
          actions.addMessage({
            type: "system",
            text: `Switched to ${msg.agentId || "new agent"}. Connecting...`,
          });
          actions.setModes([], "");
          actions.setModels([], "");
          actions.setAvailableCommands([]);
          break;

        case "chatCleared":
          actions.clearMessages();
          actions.setModes([], "");
          actions.setModels([], "");
          actions.setAvailableCommands([]);
          break;

        case "triggerNewChat":
          postMessage({ type: "newChat" });
          break;

        case "triggerClearChat":
          postMessage({ type: "clearChat" });
          break;

        case "sessionMetadata": {
          if (msg.modes?.availableModes?.length) {
            actions.setModes(msg.modes.availableModes, msg.modes.currentModeId);
          }
          if (msg.models?.availableModels?.length) {
            actions.setModels(
              msg.models.availableModels,
              msg.models.currentModelId
            );
          }
          if (msg.commands) {
            actions.setAvailableCommands(msg.commands);
          }
          break;
        }

        case "modeUpdate":
          if (msg.modeId) {
            actions.setCurrentMode(msg.modeId);
          }
          break;

        case "availableCommands":
          if (msg.commands) {
            actions.setAvailableCommands(msg.commands);
          }
          break;

        case "plan":
          if (msg.plan?.entries) {
            actions.setPlan(msg.plan.entries);
          }
          break;

        case "planComplete":
          actions.setPlan(null);
          break;

        case "filesAttached":
          if (msg.files && Array.isArray(msg.files)) {
            for (const file of msg.files) {
              actions.addAttachment({
                type: file.type || "file",
                name: file.name,
                content: file.content || "",
                path: file.path,
                language: file.language,
                lineRange: file.lineRange,
                mimeType: file.mimeType,
              });
            }
          }
          break;

        case "codeAttached":
          if (msg.code) {
            actions.addAttachment({
              type: "code",
              name: msg.code.fileName || "selection",
              content: msg.code.content,
              path: msg.code.path,
              language: msg.code.language,
              lineRange: msg.code.lineRange,
            });
          }
          break;

        case "sessions":
          if (msg.sessions) {
            actions.setSessions(msg.sessions);
          }
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
      // Cleanup all throttle timeouts
      if (streamTimeoutRef.current) {
        clearTimeout(streamTimeoutRef.current);
      }
      if (thinkingTimeoutRef.current) {
        clearTimeout(thinkingTimeoutRef.current);
      }
      if (toolTimeoutRef.current) {
        clearTimeout(toolTimeoutRef.current);
      }
    };
  }, [getActions, postMessage]);

  // Restore state on mount (intentionally run only once)
  useEffect(() => {
    restoreState();
    postMessage({ type: "ready" });
  }, []);

  // Save state when relevant values change
  useEffect(() => {
    saveState();
  }, [saveState]);

  // Auto-save session when messages change
  useEffect(() => {
    // Only save if we have messages and agent is selected
    if (messages.length > 0 && selectedAgentId) {
      const actions = getActions();

      // If no session exists, create one
      let sessionId = currentSessionId;
      if (!sessionId) {
        sessionId = actions.addSession({
          title: generateSessionTitle(messages),
          agentId: selectedAgentId,
          timestamp: Date.now(),
          messages: [],
        });
      }

      const session = {
        id: sessionId,
        title: generateSessionTitle(messages),
        agentId: selectedAgentId,
        timestamp: Date.now(),
        messages: messages.map((m) => ({
          id: m.id,
          type: m.type,
          text: m.text,
          html: m.html,
          timestamp: m.timestamp,
          attachments: m.attachments,
          tools: m.tools,
        })),
      };
      postMessage({ type: "saveSession", session });
    }
  }, [messages, currentSessionId, selectedAgentId, postMessage, getActions]);
}

// Generate a title from the first user message
function generateSessionTitle(
  messages: Array<{ type: string; text: string }>
): string {
  const firstUserMessage = messages.find((m) => m.type === "user");
  if (firstUserMessage) {
    const text = firstUserMessage.text.trim();
    return text.length > 50 ? text.substring(0, 50) + "..." : text;
  }
  return "New Chat";
}

// Hook for components to use VSCode API actions
export function useVsCodeApi() {
  const postMessage = useCallback((message: unknown) => {
    console.log("[VSCode ACP] Sending message:", message);
    vscode.postMessage(message);
  }, []);

  // Return stable function references
  return useMemo(
    () => ({
      postMessage,
      connect: () => {
        console.log("[VSCode ACP] Connect button clicked");
        postMessage({ type: "connect" });
      },
      sendMessage: (text: string, attachments?: Attachment[]) => {
        console.log(
          "[VSCode ACP] Send message:",
          text,
          "attachments:",
          attachments?.length || 0
        );
        postMessage({ type: "sendMessage", text, attachments });
      },
      selectAgent: (agentId: string) =>
        postMessage({ type: "selectAgent", agentId }),
      selectMode: (modeId: string) =>
        postMessage({ type: "selectMode", modeId }),
      selectModel: (modelId: string) =>
        postMessage({ type: "selectModel", modelId }),
      copyMessage: (text: string) => postMessage({ type: "copyMessage", text }),
      newChat: () => {
        // Create a new session locally before sending to extension
        const { addSession, selectedAgentId, clearMessages } =
          useChatStore.getState();
        clearMessages();
        addSession({
          title: "New Chat",
          agentId: selectedAgentId || "claude-code",
          timestamp: Date.now(),
          messages: [],
        });
        postMessage({ type: "newChat" });
      },
      clearChat: () => postMessage({ type: "clearChat" }),
      selectFiles: () => postMessage({ type: "selectFiles" }),
      selectImages: () => postMessage({ type: "selectImages" }),
      selectSession: (sessionId: string) => {
        const { selectSession } = useChatStore.getState();
        selectSession(sessionId);
        postMessage({ type: "selectSession", sessionId });
      },
      saveSession: (session: {
        id: string;
        title: string;
        agentId: string;
        timestamp: number;
        messages: Array<{
          id: string;
          type: string;
          text: string;
          html?: string;
          timestamp: number;
          attachments?: unknown[];
          tools?: Record<string, unknown>;
        }>;
      }) => {
        postMessage({ type: "saveSession", session });
      },
      deleteSession: (sessionId: string) => {
        const { deleteSession } = useChatStore.getState();
        deleteSession(sessionId);
        postMessage({ type: "deleteSession", sessionId });
      },
    }),
    [postMessage]
  );
}
