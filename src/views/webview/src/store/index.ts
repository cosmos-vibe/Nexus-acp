import { create } from "zustand";
import type {
  Agent,
  Mode,
  Model,
  Message,
  Tool,
  AvailableCommand,
  PlanEntry,
  Attachment,
  StoredSession,
} from "../types";

type ConnectionState = "disconnected" | "connecting" | "connected" | "error";

// Re-export for backward compatibility
export type Session = StoredSession;

interface StreamingState {
  currentText: string;
  thinkingText: string;
  tools: Record<string, Tool>;
  expandedToolId: string | null;
  hasActiveTool: boolean;
}

interface ChatStore {
  // Connection state
  connectionState: ConnectionState;
  setConnectionState: (state: ConnectionState) => void;

  // Sessions
  sessions: Session[];
  currentSessionId: string | null;
  sidebarOpen: boolean;
  setSessions: (sessions: Session[]) => void;
  addSession: (session: Omit<Session, "id">) => string;
  selectSession: (sessionId: string) => void;
  updateSessionTitle: (sessionId: string, title: string) => void;
  deleteSession: (sessionId: string) => void;
  setSidebarOpen: (open: boolean) => void;
  getCurrentSession: () => Session | null;

  // Agents
  agents: Agent[];
  selectedAgentId: string | null;
  setAgents: (agents: Agent[], selected?: string) => void;
  setSelectedAgent: (agentId: string) => void;

  // Modes & Models
  modes: Mode[];
  currentModeId: string | null;
  models: Model[];
  currentModelId: string | null;
  setModes: (modes: Mode[], currentId: string) => void;
  setModels: (models: Model[], currentId: string) => void;
  setCurrentMode: (modeId: string) => void;
  setCurrentModel: (modelId: string) => void;

  // Messages
  messages: Message[];
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  updateLastAssistantMessage: (updates: Partial<Message>) => void;
  clearMessages: () => void;

  // Streaming
  streaming: StreamingState;
  startStreaming: () => void;
  appendStreamChunk: (text: string) => void;
  endStreaming: (html?: string) => void;

  // Tools
  addTool: (toolCallId: string, tool: Tool) => void;
  updateTool: (toolCallId: string, updates: Partial<Tool>) => void;
  batchUpdateTools: (tools: Map<string, Tool>) => void;
  finalizeToolsBeforeText: () => void;

  // Commands
  availableCommands: AvailableCommand[];
  setAvailableCommands: (commands: AvailableCommand[]) => void;

  // Plan
  plan: PlanEntry[] | null;
  setPlan: (entries: PlanEntry[] | null) => void;

  // Input
  inputValue: string;
  setInputValue: (value: string) => void;

  // Attachments
  attachments: Attachment[];
  addAttachment: (attachment: Omit<Attachment, "id">) => void;
  removeAttachment: (id: string) => void;
  clearAttachments: () => void;

  // Thinking
  isThinking: boolean;
  setIsThinking: (value: boolean) => void;
  appendThinkingChunk: (text: string) => void;
  clearThinking: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // Connection state
  connectionState: "disconnected",
  setConnectionState: (connectionState) => set({ connectionState }),

  // Sessions
  sessions: [],
  currentSessionId: null,
  sidebarOpen: false,
  setSessions: (sessions) => set({ sessions }),
  addSession: (session) => {
    const id = crypto.randomUUID();
    const newSession = { ...session, id };
    set((state) => ({
      sessions: [newSession, ...state.sessions],
      currentSessionId: id,
    }));
    return id;
  },
  selectSession: (sessionId) => {
    const session = get().sessions.find((s) => s.id === sessionId);
    if (session) {
      set({
        currentSessionId: sessionId,
        messages: session.messages,
        selectedAgentId: session.agentId,
      });
    }
  },
  updateSessionTitle: (sessionId, title) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId ? { ...s, title } : s
      ),
    })),
  deleteSession: (sessionId) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== sessionId),
      currentSessionId:
        state.currentSessionId === sessionId ? null : state.currentSessionId,
    })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  getCurrentSession: () => {
    const { currentSessionId, sessions } = get();
    return sessions.find((s) => s.id === currentSessionId) || null;
  },

  // Agents
  agents: [],
  selectedAgentId: null,
  setAgents: (agents, selected) =>
    set({ agents, selectedAgentId: selected || null }),
  setSelectedAgent: (agentId) => set({ selectedAgentId: agentId }),

  // Modes & Models
  modes: [],
  currentModeId: null,
  models: [],
  currentModelId: null,
  setModes: (modes, currentId) => set({ modes, currentModeId: currentId }),
  setModels: (models, currentId) => set({ models, currentModelId: currentId }),
  setCurrentMode: (modeId) => set({ currentModeId: modeId }),
  setCurrentModel: (modelId) => set({ currentModelId: modelId }),

  // Messages
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        },
      ],
    })),
  updateLastAssistantMessage: (updates) =>
    set((state) => {
      const messages = [...state.messages];
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].type === "assistant") {
          messages[i] = { ...messages[i], ...updates };
          break;
        }
      }
      return { messages };
    }),
  clearMessages: () =>
    set({
      messages: [],
      streaming: {
        currentText: "",
        thinkingText: "",
        tools: {},
        expandedToolId: null,
        hasActiveTool: false,
      },
      plan: null,
    }),

  // Streaming
  streaming: {
    currentText: "",
    thinkingText: "",
    tools: {},
    expandedToolId: null,
    hasActiveTool: false,
  },
  startStreaming: () =>
    set({
      streaming: {
        currentText: "",
        thinkingText: "",
        tools: {},
        expandedToolId: null,
        hasActiveTool: false,
      },
      isThinking: true,
    }),
  appendStreamChunk: (text) =>
    set((state) => {
      const streaming = state.streaming;

      // If we had active tools and now getting text, finalize tools first
      if (streaming.hasActiveTool && Object.keys(streaming.tools).length > 0) {
        // Add tool message first
        const toolMessage: Message = {
          id: crypto.randomUUID(),
          type: "assistant",
          text: "",
          tools: { ...streaming.tools },
          timestamp: Date.now(),
        };

        return {
          messages: [...state.messages, toolMessage],
          streaming: {
            currentText: text,
            thinkingText: "",
            tools: {},
            expandedToolId: null,
            hasActiveTool: false,
          },
          isThinking: false,
        };
      }

      return {
        streaming: {
          ...streaming,
          currentText: streaming.currentText + text,
        },
        isThinking: false,
      };
    }),
  endStreaming: (html) =>
    set((state) => {
      const { streaming } = state;
      const finalText = streaming.currentText.trim();

      if (finalText || html || Object.keys(streaming.tools).length > 0) {
        const newMessage: Message = {
          id: crypto.randomUUID(),
          type: "assistant",
          text: finalText,
          html,
          tools:
            Object.keys(streaming.tools).length > 0
              ? { ...streaming.tools }
              : undefined,
          timestamp: Date.now(),
        };

        return {
          messages: [...state.messages, newMessage],
          streaming: {
            currentText: "",
            thinkingText: "",
            tools: {},
            expandedToolId: null,
            hasActiveTool: false,
          },
          isThinking: false,
        };
      }

      return {
        streaming: {
          currentText: "",
          thinkingText: "",
          tools: {},
          expandedToolId: null,
          hasActiveTool: false,
        },
        isThinking: false,
      };
    }),

  // Tools
  addTool: (toolCallId, tool) =>
    set((state) => {
      // If there's accumulated text, finalize it as a message first
      if (state.streaming.currentText.trim()) {
        const textMessage: Message = {
          id: crypto.randomUUID(),
          type: "assistant",
          text: state.streaming.currentText.trim(),
          timestamp: Date.now(),
        };

        return {
          messages: [...state.messages, textMessage],
          streaming: {
            currentText: "",
            thinkingText: "",
            tools: { [toolCallId]: tool },
            expandedToolId: null,
            hasActiveTool: true,
          },
          isThinking: true,
        };
      }

      return {
        streaming: {
          ...state.streaming,
          tools: { ...state.streaming.tools, [toolCallId]: tool },
          hasActiveTool: true,
        },
        isThinking: true,
      };
    }),
  updateTool: (toolCallId, updates) =>
    set((state) => ({
      streaming: {
        ...state.streaming,
        tools: {
          ...state.streaming.tools,
          [toolCallId]: { ...state.streaming.tools[toolCallId], ...updates },
        },
        expandedToolId: toolCallId,
      },
    })),
  batchUpdateTools: (toolsMap) =>
    set((state) => {
      // Convert Map to object and merge with existing tools
      const newTools: Record<string, Tool> = {};
      toolsMap.forEach((tool, id) => {
        const existingTool = state.streaming.tools[id];
        if (existingTool) {
          // Smart merge: preserve existing name if new name is "Unknown"
          newTools[id] = {
            ...existingTool,
            ...tool,
            name: tool.name === "Unknown" ? existingTool.name : tool.name,
          };
        } else {
          newTools[id] = tool;
        }
      });

      // If there's accumulated text, finalize it as a message first
      if (state.streaming.currentText.trim()) {
        const textMessage: Message = {
          id: crypto.randomUUID(),
          type: "assistant",
          text: state.streaming.currentText.trim(),
          timestamp: Date.now(),
        };

        return {
          messages: [...state.messages, textMessage],
          streaming: {
            currentText: "",
            thinkingText: "",
            tools: newTools,
            expandedToolId: null,
            hasActiveTool: true,
          },
          isThinking: true,
        };
      }

      return {
        streaming: {
          ...state.streaming,
          tools: { ...state.streaming.tools, ...newTools },
          hasActiveTool: true,
        },
        isThinking: true,
      };
    }),
  finalizeToolsBeforeText: () =>
    set((state) => {
      if (Object.keys(state.streaming.tools).length === 0) return state;

      const toolMessage: Message = {
        id: crypto.randomUUID(),
        type: "assistant",
        text: "",
        tools: { ...state.streaming.tools },
        timestamp: Date.now(),
      };

      return {
        messages: [...state.messages, toolMessage],
        streaming: {
          currentText: "",
          thinkingText: "",
          tools: {},
          expandedToolId: null,
          hasActiveTool: false,
        },
      };
    }),

  // Commands
  availableCommands: [],
  setAvailableCommands: (commands) => set({ availableCommands: commands }),

  // Plan
  plan: null,
  setPlan: (entries) => set({ plan: entries }),

  // Input
  inputValue: "",
  setInputValue: (value) => set({ inputValue: value }),

  // Attachments
  attachments: [],
  addAttachment: (attachment) =>
    set((state) => ({
      attachments: [
        ...state.attachments,
        { ...attachment, id: crypto.randomUUID() },
      ],
    })),
  removeAttachment: (id) =>
    set((state) => ({
      attachments: state.attachments.filter((a) => a.id !== id),
    })),
  clearAttachments: () => set({ attachments: [] }),

  // Thinking
  isThinking: false,
  setIsThinking: (value) => set({ isThinking: value }),
  appendThinkingChunk: (text) => {
    const prevLen = get().streaming.thinkingText.length;
    console.log(
      `[DEBUG] appendThinkingChunk called: +${text.length} chars, total will be: ${prevLen + text.length} chars`
    );
    set((state) => ({
      streaming: {
        ...state.streaming,
        thinkingText: state.streaming.thinkingText + text,
      },
    }));
  },
  clearThinking: () =>
    set((state) => ({
      streaming: {
        ...state.streaming,
        thinkingText: "",
      },
    })),
}));
