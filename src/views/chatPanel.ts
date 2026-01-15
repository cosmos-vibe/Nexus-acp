import * as vscode from "vscode";
import { marked } from "marked";
import { ACPClient } from "../acp/client";
import {
  getAgent,
  getAgentsWithStatus,
  getFirstAvailableAgent,
} from "../acp/agents";
import type {
  SessionNotification,
  ContentBlock,
} from "@agentclientprotocol/sdk";

marked.setOptions({
  breaks: true,
  gfm: true,
});

const SELECTED_AGENT_KEY = "nexus.selectedAgent";
const SELECTED_MODE_KEY = "nexus.selectedMode";
const SELECTED_MODEL_KEY = "nexus.selectedModel";
const SESSIONS_KEY = "nexus.sessions";

interface StoredMessage {
  id: string;
  type: "user" | "assistant" | "error" | "system";
  text: string;
  html?: string;
  timestamp: number;
  attachments?: Attachment[];
  tools?: Record<string, unknown>;
}

interface StoredSession {
  id: string;
  title: string;
  agentId: string;
  timestamp: number;
  messages: StoredMessage[];
}

interface Attachment {
  id: string;
  type: "file" | "image" | "code";
  name: string;
  content: string;
  path?: string;
  language?: string;
  lineRange?: [number, number];
  mimeType?: string;
}

interface WebviewMessage {
  type:
    | "sendMessage"
    | "ready"
    | "selectAgent"
    | "selectMode"
    | "selectModel"
    | "connect"
    | "newChat"
    | "clearChat"
    | "copyMessage"
    | "selectFiles"
    | "selectImages"
    | "saveSession"
    | "loadSession"
    | "deleteSession"
    | "getSessions";
  text?: string;
  agentId?: string;
  modeId?: string;
  modelId?: string;
  attachments?: Attachment[];
  session?: StoredSession;
  sessionId?: string;
}

// 각 패널의 독립적인 상태를 관리하는 컨텍스트
interface PanelContext {
  panel: vscode.WebviewPanel;
  acpClient: ACPClient;
  hasSession: boolean;
  streamingText: string;
  hasRestoredModeModel: boolean;
  stderrBuffer: string;
}

export class ChatPanelManager {
  public static readonly viewType = "nexus.chatPanel";

  private contexts: Map<string, PanelContext> = new Map();
  private activePanelId?: string;
  private panelCounter = 0;
  private globalState: vscode.Memento;
  private disposables: vscode.Disposable[] = [];
  private onGlobalStateChange?: (
    state: "disconnected" | "connecting" | "connected" | "error"
  ) => void;

  constructor(
    private readonly extensionUri: vscode.Uri,
    globalState: vscode.Memento,
    onGlobalStateChange?: (
      state: "disconnected" | "connecting" | "connected" | "error"
    ) => void
  ) {
    this.globalState = globalState;
    this.onGlobalStateChange = onGlobalStateChange;
  }

  public hasVisiblePanel(): boolean {
    if (!this.activePanelId || !this.contexts.has(this.activePanelId)) {
      return false;
    }
    return this.contexts.get(this.activePanelId)!.panel.visible;
  }

  public showOrCreatePanel(): void {
    if (this.activePanelId && this.contexts.has(this.activePanelId)) {
      this.contexts
        .get(this.activePanelId)!
        .panel.reveal(vscode.ViewColumn.One);
      return;
    }

    this.createNewPanel();
  }

  public createNewPanel(): void {
    this.panelCounter++;
    const panelId = `panel-${this.panelCounter}`;
    const title =
      this.panelCounter === 1
        ? "Nexus Chat"
        : `Nexus Chat ${this.panelCounter}`;

    const panel = vscode.window.createWebviewPanel(
      ChatPanelManager.viewType,
      title,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [this.extensionUri],
      }
    );

    panel.iconPath = {
      light: vscode.Uri.joinPath(this.extensionUri, "assets", "icon-light.svg"),
      dark: vscode.Uri.joinPath(this.extensionUri, "assets", "icon-dark.svg"),
    };

    panel.webview.html = this.getHtmlContent(panel.webview);

    // 패널별 독립 ACPClient 생성
    const acpClient = new ACPClient();

    // 저장된 에이전트 설정 적용
    const savedAgentId = this.globalState.get<string>(SELECTED_AGENT_KEY);
    if (savedAgentId) {
      const agent = getAgent(savedAgentId);
      if (agent) {
        acpClient.setAgent(agent);
      }
    } else {
      acpClient.setAgent(getFirstAvailableAgent());
    }

    // PanelContext 생성
    const ctx: PanelContext = {
      panel,
      acpClient,
      hasSession: false,
      streamingText: "",
      hasRestoredModeModel: false,
      stderrBuffer: "",
    };

    this.contexts.set(panelId, ctx);
    this.activePanelId = panelId;

    // 패널별 이벤트 리스너 설정
    acpClient.setOnStateChange((state) => {
      this.postMessageToPanel(panelId, { type: "connectionState", state });
      // 연결이 끊어지면 세션도 리셋
      if (state === "disconnected" || state === "error") {
        const context = this.contexts.get(panelId);
        if (context) {
          context.hasSession = false;
        }
      }
      // 상태 표시줄 업데이트를 위한 글로벌 콜백
      if (this.activePanelId === panelId && this.onGlobalStateChange) {
        this.onGlobalStateChange(state);
      }
    });

    acpClient.setOnSessionUpdate((update) => {
      this.handleSessionUpdate(panelId, update);
    });

    acpClient.setOnStderr((text) => {
      this.handleStderr(panelId, text);
    });

    panel.webview.onDidReceiveMessage(
      async (message: WebviewMessage) => {
        // Set this panel as active when it receives messages
        this.activePanelId = panelId;

        switch (message.type) {
          case "sendMessage":
            if (
              message.text ||
              (message.attachments && message.attachments.length > 0)
            ) {
              await this.handleUserMessage(
                panelId,
                message.text || "",
                message.attachments
              );
            }
            break;
          case "selectAgent":
            if (message.agentId) {
              await this.handleAgentChange(panelId, message.agentId);
            }
            break;
          case "selectMode":
            if (message.modeId) {
              await this.handleModeChange(panelId, message.modeId);
            }
            break;
          case "selectModel":
            if (message.modelId) {
              await this.handleModelChange(panelId, message.modelId);
            }
            break;
          case "connect":
            await this.handleConnect(panelId);
            break;
          case "newChat":
            await this.handleNewChat(panelId);
            break;
          case "clearChat":
            this.handleClearChat(panelId);
            break;
          case "copyMessage":
            if (message.text) {
              await vscode.env.clipboard.writeText(message.text);
              vscode.window.showInformationMessage(
                "Message copied to clipboard"
              );
            }
            break;
          case "ready":
            this.postMessageToPanel(panelId, {
              type: "connectionState",
              state: ctx.acpClient.getState(),
            });
            const agentsWithStatus = getAgentsWithStatus();
            this.postMessageToPanel(panelId, {
              type: "agents",
              agents: agentsWithStatus.map((a) => ({
                id: a.id,
                name: a.name,
                available: a.available,
              })),
              selected: ctx.acpClient.getAgentId(),
            });
            this.sendSessionMetadata(panelId);
            this.sendStoredSessions(panelId);
            break;
          case "saveSession":
            if (message.session) {
              this.saveSession(message.session);
            }
            break;
          case "deleteSession":
            if (message.sessionId) {
              this.deleteSession(message.sessionId);
            }
            break;
          case "getSessions":
            this.sendStoredSessions(panelId);
            break;
          case "selectFiles":
            await this.handleSelectFiles(panelId);
            break;
          case "selectImages":
            await this.handleSelectImages(panelId);
            break;
        }
      },
      undefined,
      this.disposables
    );

    panel.onDidDispose(
      () => {
        // 패널 정리 시 해당 acpClient도 정리
        const context = this.contexts.get(panelId);
        if (context) {
          context.acpClient.dispose();
        }
        this.contexts.delete(panelId);
        if (this.activePanelId === panelId) {
          // Set another panel as active if available
          const remainingPanels = Array.from(this.contexts.keys());
          this.activePanelId =
            remainingPanels.length > 0 ? remainingPanels[0] : undefined;
        }
      },
      undefined,
      this.disposables
    );

    panel.onDidChangeViewState(
      (e) => {
        if (e.webviewPanel.visible) {
          this.activePanelId = panelId;
          const context = this.contexts.get(panelId);
          if (context) {
            this.postMessageToPanel(panelId, {
              type: "connectionState",
              state: context.acpClient.getState(),
            });
            // 상태 표시줄 업데이트
            if (this.onGlobalStateChange) {
              this.onGlobalStateChange(context.acpClient.getState());
            }
          }
        }
      },
      undefined,
      this.disposables
    );
  }

  public newChat(): void {
    if (this.activePanelId) {
      this.postMessageToPanel(this.activePanelId, { type: "triggerNewChat" });
    }
  }

  public clearChat(): void {
    if (this.activePanelId) {
      this.postMessageToPanel(this.activePanelId, { type: "triggerClearChat" });
    }
  }

  public dispose(): void {
    this.contexts.forEach((ctx, _panelId) => {
      ctx.acpClient.dispose();
      ctx.panel.dispose();
    });
    this.contexts.clear();
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
  }

  // 현재 활성 패널의 연결 상태 확인
  public isConnected(): boolean {
    if (this.activePanelId) {
      const ctx = this.contexts.get(this.activePanelId);
      return ctx?.acpClient.isConnected() ?? false;
    }
    return false;
  }

  // 현재 활성 패널 연결
  public async connect(): Promise<void> {
    if (this.activePanelId) {
      const ctx = this.contexts.get(this.activePanelId);
      if (ctx && !ctx.acpClient.isConnected()) {
        await ctx.acpClient.connect();
      }
    }
  }

  private handleStderr(panelId: string, text: string): void {
    const ctx = this.contexts.get(panelId);
    if (!ctx) return;

    ctx.stderrBuffer += text;

    const errorMatch = ctx.stderrBuffer.match(
      /(\w+Error):\s*(\w+)?\s*\n?\s*data:\s*\{([^}]+)\}/
    );
    if (errorMatch) {
      const errorType = errorMatch[1];
      const errorData = errorMatch[3];
      const providerMatch = errorData.match(/providerID:\s*"([^"]+)"/);
      const modelMatch = errorData.match(/modelID:\s*"([^"]+)"/);

      let message = `Agent error: ${errorType}`;
      if (providerMatch && modelMatch) {
        message = `Model not found: ${providerMatch[1]}/${modelMatch[1]}`;
      }

      this.postMessageToPanel(panelId, { type: "agentError", text: message });
      ctx.stderrBuffer = "";
    }

    if (ctx.stderrBuffer.length > 10000) {
      ctx.stderrBuffer = ctx.stderrBuffer.slice(-5000);
    }
  }

  private handleSessionUpdate(
    panelId: string,
    notification: SessionNotification
  ): void {
    const ctx = this.contexts.get(panelId);
    if (!ctx) return;

    const update = notification.update;
    console.log(
      `[Chat:${panelId}] Session update received:`,
      update.sessionUpdate
    );

    if (update.sessionUpdate === "agent_message_chunk") {
      console.log(
        `[Chat:${panelId}] Chunk content:`,
        JSON.stringify(update.content)
      );
      if (update.content.type === "text") {
        ctx.streamingText += update.content.text;
        this.postMessageToPanel(panelId, {
          type: "streamChunk",
          text: update.content.text,
        });
      } else {
        console.log(
          `[Chat:${panelId}] Non-text chunk type:`,
          update.content.type
        );
      }
    } else if (update.sessionUpdate === "agent_thought_chunk") {
      // Thinking/reasoning 스트리밍 처리
      if (update.content.type === "text") {
        this.postMessageToPanel(panelId, {
          type: "thinkingChunk",
          text: update.content.text,
        });
      }
    } else if (update.sessionUpdate === "tool_call") {
      this.postMessageToPanel(panelId, {
        type: "toolCallStart",
        name: update.title,
        toolCallId: update.toolCallId,
        kind: update.kind,
      });
    } else if (update.sessionUpdate === "tool_call_update") {
      if (update.status === "completed" || update.status === "failed") {
        this.postMessageToPanel(panelId, {
          type: "toolCallComplete",
          toolCallId: update.toolCallId,
          title: update.title,
          kind: update.kind,
          content: update.content,
          rawInput: update.rawInput,
          rawOutput: update.rawOutput,
          status: update.status,
        });
      }
    } else if (update.sessionUpdate === "current_mode_update") {
      this.postMessageToPanel(panelId, {
        type: "modeUpdate",
        modeId: update.currentModeId,
      });
    } else if (update.sessionUpdate === "available_commands_update") {
      this.postMessageToPanel(panelId, {
        type: "availableCommands",
        commands: update.availableCommands,
      });
    } else if (update.sessionUpdate === "plan") {
      this.postMessageToPanel(panelId, {
        type: "plan",
        plan: { entries: update.entries },
      });
    }
  }

  private async handleUserMessage(
    panelId: string,
    text: string,
    attachments?: Attachment[]
  ): Promise<void> {
    const ctx = this.contexts.get(panelId);
    if (!ctx) return;

    // ContentBlock 배열 생성 (에이전트에게 전송)
    const contentBlocks: ContentBlock[] = [];
    // 사용자 UI에 표시할 텍스트 (첨부파일 요약 포함)
    const displayParts: string[] = [];

    if (attachments && attachments.length > 0) {
      for (const att of attachments) {
        if (att.type === "image") {
          // 이미지는 ContentBlock으로 전송 (에이전트가 실제로 볼 수 있음)
          // data:image/png;base64,... 형식에서 base64 부분만 추출
          const base64Data = att.content.includes(",")
            ? att.content.split(",")[1]
            : att.content;
          contentBlocks.push({
            type: "image",
            data: base64Data,
            mimeType: att.mimeType || "image/png",
          });
          displayParts.push(`[Image: ${att.name}]`);
        } else if (att.type === "code") {
          const lang = att.language || "";
          const range = att.lineRange
            ? ` (lines ${att.lineRange[0]}-${att.lineRange[1]})`
            : "";
          const codeBlock = `\`\`\`${lang}\n// File: ${att.path || att.name}${range}\n${att.content}\n\`\`\``;
          contentBlocks.push({ type: "text", text: codeBlock });
          displayParts.push(codeBlock);
        } else {
          // 일반 파일
          const fileBlock = `\`\`\`\n// File: ${att.path || att.name}\n${att.content}\n\`\`\``;
          contentBlocks.push({ type: "text", text: fileBlock });
          displayParts.push(fileBlock);
        }
      }
    }

    // 메인 텍스트 추가
    if (text) {
      contentBlocks.push({ type: "text", text });
      displayParts.push(text);
    }

    const displayMessage = displayParts.join("\n\n");
    // 이미지 첨부파일만 추출해서 UI에 전달
    const imageAttachments =
      attachments?.filter((att) => att.type === "image") || [];
    this.postMessageToPanel(panelId, {
      type: "userMessage",
      text: displayMessage,
      attachments: imageAttachments.length > 0 ? imageAttachments : undefined,
    });

    try {
      // 연결되지 않았으면 연결 시도
      const state = ctx.acpClient.getState();
      if (state === "disconnected" || state === "error") {
        await ctx.acpClient.connect();
        // 연결 후 잠시 대기 (프로세스 안정화)
        await new Promise((resolve) => setTimeout(resolve, 100));
      } else if (state === "connecting") {
        // 연결 중이면 연결 완료 대기
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // 연결 상태 재확인 (프로세스가 즉시 종료된 경우 대비)
      if (!ctx.acpClient.isConnected()) {
        throw new Error(
          "Agent process terminated unexpectedly. Please try again."
        );
      }

      if (!ctx.hasSession) {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        const workingDir = workspaceFolder?.uri.fsPath || process.cwd();
        await ctx.acpClient.newSession(workingDir);
        ctx.hasSession = true;
        this.sendSessionMetadata(panelId);
      }

      ctx.streamingText = "";
      ctx.stderrBuffer = "";
      this.postMessageToPanel(panelId, { type: "streamStart" });
      console.log(`[Chat:${panelId}] Sending message to ACP...`);
      const response = await ctx.acpClient.sendMessage(contentBlocks);
      console.log(
        `[Chat:${panelId}] Prompt response received:`,
        JSON.stringify(response, null, 2)
      );

      if (ctx.streamingText.length === 0) {
        console.warn(`[Chat:${panelId}] No streaming text received from agent`);
        console.warn(`[Chat:${panelId}] stderr buffer:`, ctx.stderrBuffer);
        console.warn(
          `[Chat:${panelId}] Response:`,
          JSON.stringify(response, null, 2)
        );
        this.postMessageToPanel(panelId, {
          type: "error",
          text: "Agent returned no response. Check the ACP output channel for details.",
        });
        this.postMessageToPanel(panelId, {
          type: "streamEnd",
          stopReason: "error",
          html: "",
        });
      } else {
        const renderedHtml = marked.parse(ctx.streamingText) as string;
        this.postMessageToPanel(panelId, {
          type: "streamEnd",
          stopReason: response.stopReason,
          html: renderedHtml,
        });
      }
      ctx.streamingText = "";
    } catch (error) {
      console.error(`[Chat:${panelId}] Error in handleUserMessage:`, error);
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      this.postMessageToPanel(panelId, {
        type: "error",
        text: `Error: ${errorMessage}`,
      });
      this.postMessageToPanel(panelId, {
        type: "streamEnd",
        stopReason: "error",
        html: "",
      });
      ctx.streamingText = "";
      ctx.stderrBuffer = "";
    }
  }

  private async handleSelectFiles(panelId: string): Promise<void> {
    const result = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectMany: true,
      filters: {
        "All Files": ["*"],
        "Code Files": [
          "ts",
          "tsx",
          "js",
          "jsx",
          "py",
          "java",
          "c",
          "cpp",
          "go",
          "rs",
          "rb",
          "php",
        ],
        "Text Files": [
          "txt",
          "md",
          "json",
          "yaml",
          "yml",
          "xml",
          "html",
          "css",
        ],
      },
    });

    if (result && result.length > 0) {
      const files = await Promise.all(
        result.map(async (uri) => {
          const content = await vscode.workspace.fs.readFile(uri);
          const textContent = new TextDecoder().decode(content);
          const fileName = uri.path.split("/").pop() || "file";
          const ext = fileName.split(".").pop() || "";

          return {
            type: "file" as const,
            name: fileName,
            content: textContent,
            path: uri.fsPath,
            language: this.getLanguageFromExtension(ext),
          };
        })
      );

      this.postMessageToPanel(panelId, {
        type: "filesAttached",
        files,
      });
    }
  }

  private async handleSelectImages(panelId: string): Promise<void> {
    const result = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectMany: true,
      filters: {
        Images: ["png", "jpg", "jpeg", "gif", "webp", "svg"],
      },
    });

    if (result && result.length > 0) {
      const files = await Promise.all(
        result.map(async (uri) => {
          const content = await vscode.workspace.fs.readFile(uri);
          const base64 = Buffer.from(content).toString("base64");
          const fileName = uri.path.split("/").pop() || "image";
          const ext = fileName.split(".").pop()?.toLowerCase() || "png";
          const mimeType = `image/${ext === "jpg" ? "jpeg" : ext}`;

          return {
            type: "image" as const,
            name: fileName,
            content: `data:${mimeType};base64,${base64}`,
            path: uri.fsPath,
            mimeType,
          };
        })
      );

      this.postMessageToPanel(panelId, {
        type: "filesAttached",
        files,
      });
    }
  }

  private getLanguageFromExtension(ext: string): string {
    const langMap: Record<string, string> = {
      ts: "typescript",
      tsx: "typescript",
      js: "javascript",
      jsx: "javascript",
      py: "python",
      java: "java",
      c: "c",
      cpp: "cpp",
      go: "go",
      rs: "rust",
      rb: "ruby",
      php: "php",
      html: "html",
      css: "css",
      json: "json",
      yaml: "yaml",
      yml: "yaml",
      xml: "xml",
      md: "markdown",
      sh: "bash",
      sql: "sql",
    };
    return langMap[ext.toLowerCase()] || "";
  }

  // 에디터에서 선택한 코드를 채팅에 첨부
  public attachSelectedCode(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor || !this.activePanelId) return;

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    if (!selectedText) {
      vscode.window.showWarningMessage("No text selected");
      return;
    }

    const fileName = editor.document.fileName.split("/").pop() || "selection";
    const languageId = editor.document.languageId;
    const startLine = selection.start.line + 1;
    const endLine = selection.end.line + 1;

    this.postMessageToPanel(this.activePanelId, {
      type: "codeAttached",
      code: {
        fileName,
        content: selectedText,
        path: editor.document.fileName,
        language: languageId,
        lineRange: [startLine, endLine] as [number, number],
      },
    });
  }

  // 파일 탐색기에서 파일을 채팅에 첨부
  public async attachFile(uri: vscode.Uri): Promise<void> {
    if (!this.activePanelId) {
      // 패널이 없으면 새로 생성
      this.createNewPanel();
    }

    const content = await vscode.workspace.fs.readFile(uri);
    const fileName = uri.path.split("/").pop() || "file";
    const ext = fileName.split(".").pop() || "";
    const isImage = ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(
      ext.toLowerCase()
    );

    if (isImage) {
      const base64 = Buffer.from(content).toString("base64");
      const mimeType = `image/${ext === "jpg" ? "jpeg" : ext}`;

      this.postMessageToPanel(this.activePanelId!, {
        type: "filesAttached",
        files: [
          {
            type: "image",
            name: fileName,
            content: `data:${mimeType};base64,${base64}`,
            path: uri.fsPath,
            mimeType,
          },
        ],
      });
    } else {
      const textContent = new TextDecoder().decode(content);

      this.postMessageToPanel(this.activePanelId!, {
        type: "filesAttached",
        files: [
          {
            type: "file",
            name: fileName,
            content: textContent,
            path: uri.fsPath,
            language: this.getLanguageFromExtension(ext),
          },
        ],
      });
    }
  }

  private async handleAgentChange(
    panelId: string,
    agentId: string
  ): Promise<void> {
    const ctx = this.contexts.get(panelId);
    if (!ctx) return;

    const agent = getAgent(agentId);
    if (agent) {
      ctx.acpClient.setAgent(agent);
      this.globalState.update(SELECTED_AGENT_KEY, agentId);
      ctx.hasSession = false;
      ctx.hasRestoredModeModel = false;
      this.postMessageToPanel(panelId, { type: "agentChanged", agentId });
      this.postMessageToPanel(panelId, {
        type: "sessionMetadata",
        modes: null,
        models: null,
      });

      // Auto-reconnect and create session after agent change
      try {
        await ctx.acpClient.connect();

        // Wait for connection to stabilize and verify it's still active
        await new Promise((resolve) => setTimeout(resolve, 200));

        if (!ctx.acpClient.isConnected()) {
          throw new Error(
            `Agent "${agentId}" failed to start. Check if the agent is properly installed.`
          );
        }

        // Create new session
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        const workingDir = workspaceFolder?.uri.fsPath || process.cwd();
        await ctx.acpClient.newSession(workingDir);
        ctx.hasSession = true;
        this.sendSessionMetadata(panelId);

        // 세션 초기화 후 메타데이터가 업데이트될 수 있으므로 잠시 후 다시 전송
        setTimeout(() => {
          this.sendSessionMetadata(panelId);
        }, 500);
      } catch (error) {
        console.error(
          `[Chat:${panelId}] Failed to reconnect after agent change:`,
          error
        );
        this.postMessageToPanel(panelId, {
          type: "error",
          text:
            error instanceof Error
              ? error.message
              : "Failed to connect to new agent",
        });
      }
    }
  }

  private async handleModeChange(
    panelId: string,
    modeId: string
  ): Promise<void> {
    const ctx = this.contexts.get(panelId);
    if (!ctx) return;

    try {
      await ctx.acpClient.setMode(modeId);
      await this.globalState.update(SELECTED_MODE_KEY, modeId);
      this.sendSessionMetadata(panelId);
    } catch (error) {
      console.error(`[Chat:${panelId}] Failed to set mode:`, error);
    }
  }

  private async handleModelChange(
    panelId: string,
    modelId: string
  ): Promise<void> {
    const ctx = this.contexts.get(panelId);
    if (!ctx) return;

    try {
      await ctx.acpClient.setModel(modelId);
      await this.globalState.update(SELECTED_MODEL_KEY, modelId);
      this.sendSessionMetadata(panelId);
    } catch (error) {
      console.error(`[Chat:${panelId}] Failed to set model:`, error);
    }
  }

  private async handleConnect(panelId: string): Promise<void> {
    const ctx = this.contexts.get(panelId);
    if (!ctx) return;

    try {
      if (!ctx.acpClient.isConnected()) {
        await ctx.acpClient.connect();
      }
      if (!ctx.hasSession) {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        const workingDir = workspaceFolder?.uri.fsPath || process.cwd();
        await ctx.acpClient.newSession(workingDir);
        ctx.hasSession = true;
        this.sendSessionMetadata(panelId);

        // 세션 초기화 후 메타데이터가 업데이트될 수 있으므로 잠시 후 다시 전송
        setTimeout(() => {
          this.sendSessionMetadata(panelId);
        }, 500);
      }
    } catch (error) {
      this.postMessageToPanel(panelId, {
        type: "error",
        text: error instanceof Error ? error.message : "Failed to connect",
      });
    }
  }

  private async handleNewChat(panelId: string): Promise<void> {
    const ctx = this.contexts.get(panelId);
    if (!ctx) return;

    ctx.hasSession = false;
    ctx.hasRestoredModeModel = false;
    ctx.streamingText = "";
    this.postMessageToPanel(panelId, { type: "chatCleared" });
    this.postMessageToPanel(panelId, {
      type: "sessionMetadata",
      modes: null,
      models: null,
    });

    try {
      if (ctx.acpClient.isConnected()) {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        const workingDir = workspaceFolder?.uri.fsPath || process.cwd();
        await ctx.acpClient.newSession(workingDir);
        ctx.hasSession = true;
        this.sendSessionMetadata(panelId);
      }
    } catch (error) {
      console.error(`[Chat:${panelId}] Failed to create new session:`, error);
    }
  }

  private handleClearChat(panelId: string): void {
    this.postMessageToPanel(panelId, { type: "chatCleared" });
  }

  // Session storage methods
  private getStoredSessions(): StoredSession[] {
    return this.globalState.get<StoredSession[]>(SESSIONS_KEY, []);
  }

  private saveSession(session: StoredSession): void {
    const sessions = this.getStoredSessions();
    const existingIndex = sessions.findIndex((s) => s.id === session.id);

    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.unshift(session); // Add to beginning
    }

    // Keep only last 50 sessions
    const trimmedSessions = sessions.slice(0, 50);
    this.globalState.update(SESSIONS_KEY, trimmedSessions);

    // Broadcast to all panels
    this.contexts.forEach((_, panelId) => {
      this.sendStoredSessions(panelId);
    });
  }

  private deleteSession(sessionId: string): void {
    const sessions = this.getStoredSessions();
    const filteredSessions = sessions.filter((s) => s.id !== sessionId);
    this.globalState.update(SESSIONS_KEY, filteredSessions);

    // Broadcast to all panels
    this.contexts.forEach((_, panelId) => {
      this.sendStoredSessions(panelId);
    });
  }

  private sendStoredSessions(panelId: string): void {
    const sessions = this.getStoredSessions();
    this.postMessageToPanel(panelId, {
      type: "sessions",
      sessions,
    });
  }

  private sendSessionMetadata(panelId: string): void {
    const ctx = this.contexts.get(panelId);
    if (!ctx) return;

    const metadata = ctx.acpClient.getSessionMetadata();
    this.postMessageToPanel(panelId, {
      type: "sessionMetadata",
      modes: metadata?.modes ?? null,
      models: metadata?.models ?? null,
      commands: metadata?.commands ?? null,
    });

    if (!ctx.hasRestoredModeModel && ctx.hasSession) {
      ctx.hasRestoredModeModel = true;
      this.restoreSavedModeAndModel(panelId).catch((error) =>
        console.warn(
          `[Chat:${panelId}] Failed to restore saved mode/model:`,
          error
        )
      );
    }
  }

  private async restoreSavedModeAndModel(panelId: string): Promise<void> {
    const ctx = this.contexts.get(panelId);
    if (!ctx) return;

    const metadata = ctx.acpClient.getSessionMetadata();
    const availableModes = Array.isArray(metadata?.modes?.availableModes)
      ? metadata.modes.availableModes
      : [];
    const availableModels = Array.isArray(metadata?.models?.availableModels)
      ? metadata.models.availableModels
      : [];

    const savedModeId = this.globalState.get<string>(SELECTED_MODE_KEY);
    const savedModelId = this.globalState.get<string>(SELECTED_MODEL_KEY);

    let modeRestored = false;
    let modelRestored = false;

    if (
      savedModeId &&
      availableModes.some((mode: any) => mode && mode.id === savedModeId)
    ) {
      await ctx.acpClient.setMode(savedModeId);
      console.log(`[Chat:${panelId}] Restored mode: ${savedModeId}`);
      modeRestored = true;
    }

    if (
      savedModelId &&
      availableModels.some(
        (model: any) => model && model.modelId === savedModelId
      )
    ) {
      await ctx.acpClient.setModel(savedModelId);
      console.log(`[Chat:${panelId}] Restored model: ${savedModelId}`);
      modelRestored = true;
    }

    if (modeRestored || modelRestored) {
      this.postMessageToPanel(panelId, {
        type: "sessionMetadata",
        ...metadata,
      });
    }
  }

  private postMessageToPanel(
    panelId: string,
    message: Record<string, unknown>
  ): void {
    const ctx = this.contexts.get(panelId);
    if (ctx) {
      ctx.panel.webview.postMessage(message);
    }
  }

  private getHtmlContent(webview: vscode.Webview): string {
    const webviewScriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "out", "webview", "webview.js")
    );
    const webviewStyleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "out", "webview", "webview.css")
    );

    const nonce = this.getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; font-src ${webview.cspSource}; img-src ${webview.cspSource} data:;">
  <link href="${webviewStyleUri}" rel="stylesheet">
  <title>Nexus Chat</title>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}" src="${webviewScriptUri}"></script>
</body>
</html>`;
  }

  private getNonce(): string {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
