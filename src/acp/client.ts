import { ChildProcess, spawn as nodeSpawn, SpawnOptions } from "child_process";
import { Readable, Writable } from "stream";
import {
  ClientSideConnection,
  ndJsonStream,
  type Client,
  type SessionNotification,
  type RequestPermissionRequest,
  type RequestPermissionResponse,
  type InitializeResponse,
  type NewSessionResponse,
  type PromptResponse,
  type SessionModeState,
  type SessionModelState,
  type AvailableCommand,
  type ContentBlock,
} from "@agentclientprotocol/sdk";
import { type AgentConfig, getDefaultAgent, isAgentAvailable } from "./agents";

export interface SessionMetadata {
  modes: SessionModeState | null;
  models: SessionModelState | null;
  commands: AvailableCommand[] | null;
}

export type ACPConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

type StateChangeCallback = (state: ACPConnectionState) => void;
type SessionUpdateCallback = (update: SessionNotification) => void;
type StderrCallback = (data: string) => void;

export type SpawnFunction = (
  command: string,
  args: string[],
  options: SpawnOptions
) => ChildProcess;

export interface ACPClientOptions {
  agentConfig?: AgentConfig;
  spawn?: SpawnFunction;
  skipAvailabilityCheck?: boolean;
}

export class ACPClient {
  private process: ChildProcess | null = null;
  private processId: number = 0;
  private connection: ClientSideConnection | null = null;
  private state: ACPConnectionState = "disconnected";
  private currentSessionId: string | null = null;
  private sessionMetadata: SessionMetadata | null = null;
  private pendingCommands: AvailableCommand[] | null = null;
  private stateChangeListeners: Set<StateChangeCallback> = new Set();
  private sessionUpdateListeners: Set<SessionUpdateCallback> = new Set();
  private stderrListeners: Set<StderrCallback> = new Set();
  private agentConfig: AgentConfig;
  private spawnFn: SpawnFunction;
  private skipAvailabilityCheck: boolean;

  constructor(options?: ACPClientOptions | AgentConfig) {
    if (options && "id" in options) {
      this.agentConfig = options;
      this.spawnFn = nodeSpawn as SpawnFunction;
      this.skipAvailabilityCheck = false;
    } else {
      this.agentConfig = options?.agentConfig ?? getDefaultAgent();
      this.spawnFn = options?.spawn ?? (nodeSpawn as SpawnFunction);
      this.skipAvailabilityCheck = options?.skipAvailabilityCheck ?? false;
    }
  }

  setAgent(config: AgentConfig): void {
    if (this.state !== "disconnected") {
      this.dispose();
    }
    this.agentConfig = config;
  }

  getAgentId(): string {
    return this.agentConfig.id;
  }

  setOnStateChange(callback: StateChangeCallback): () => void {
    this.stateChangeListeners.add(callback);
    return () => this.stateChangeListeners.delete(callback);
  }

  setOnSessionUpdate(callback: SessionUpdateCallback): () => void {
    this.sessionUpdateListeners.add(callback);
    return () => this.sessionUpdateListeners.delete(callback);
  }

  setOnStderr(callback: StderrCallback): () => void {
    this.stderrListeners.add(callback);
    return () => this.stderrListeners.delete(callback);
  }

  isConnected(): boolean {
    return this.state === "connected" && this.connection !== null;
  }

  getState(): ACPConnectionState {
    return this.state;
  }

  async connect(): Promise<InitializeResponse> {
    if (this.state === "connected" || this.state === "connecting") {
      throw new Error("Already connected or connecting");
    }

    if (!this.skipAvailabilityCheck && !isAgentAvailable(this.agentConfig.id)) {
      throw new Error(
        `Agent "${this.agentConfig.name}" is not installed. ` +
          `Please install "${this.agentConfig.command}" and try again.`
      );
    }

    this.setState("connecting");

    // Track if process exits during connection
    let processExited = false;
    let exitCode: number | null = null;

    // Increment process ID to invalidate old handlers
    const currentProcessId = ++this.processId;

    try {
      this.process = this.spawnFn(
        this.agentConfig.command,
        this.agentConfig.args,
        {
          stdio: ["pipe", "pipe", "pipe"],
          env: { ...process.env },
        }
      );

      this.process.stderr?.on("data", (data: Buffer) => {
        const text = data.toString();
        console.error("[ACP stderr]", text);
        this.stderrListeners.forEach((cb) => cb(text));
      });

      this.process.on("error", (error) => {
        // Ignore events from old processes
        if (currentProcessId !== this.processId) {
          console.log("[ACP] Ignoring error from old process");
          return;
        }
        console.error("[ACP] Process error:", error);
        processExited = true;
        this.setState("error");
      });

      this.process.on("exit", (code) => {
        // Ignore events from old processes
        if (currentProcessId !== this.processId) {
          console.log("[ACP] Ignoring exit from old process");
          return;
        }
        console.log("[ACP] Process exited with code:", code);
        processExited = true;
        exitCode = code;
        this.setState("disconnected");
        this.connection = null;
        this.process = null;
      });

      // Give process a moment to fail immediately if command doesn't exist
      await new Promise((resolve) => setTimeout(resolve, 50));
      if (processExited || !this.process) {
        throw new Error(
          `Agent process exited immediately (code: ${exitCode}). ` +
            `Make sure "${this.agentConfig.command}" is properly installed.`
        );
      }

      // Verify stdin/stdout are available
      if (!this.process.stdin || !this.process.stdout) {
        throw new Error(
          `Agent process started but stdin/stdout not available. ` +
            `There may be an issue with the agent configuration.`
        );
      }

      const stream = ndJsonStream(
        Writable.toWeb(this.process.stdin) as WritableStream<Uint8Array>,
        Readable.toWeb(this.process.stdout) as ReadableStream<Uint8Array>
      );

      const client: Client = {
        requestPermission: async (
          params: RequestPermissionRequest
        ): Promise<RequestPermissionResponse> => {
          console.log(
            "[ACP] Permission request:",
            JSON.stringify(params, null, 2)
          );
          const allowOption = params.options.find(
            (opt) => opt.kind === "allow_once" || opt.kind === "allow_always"
          );
          if (allowOption) {
            console.log(
              "[ACP] Auto-approving with option:",
              allowOption.optionId
            );
            return {
              outcome: { outcome: "selected", optionId: allowOption.optionId },
            };
          }
          console.log("[ACP] No allow option found, cancelling");
          return { outcome: { outcome: "cancelled" } };
        },
        sessionUpdate: async (params: SessionNotification): Promise<void> => {
          const updateType = params.update?.sessionUpdate ?? "unknown";
          console.log(`[ACP] Session update: ${updateType}`);
          if (updateType === "agent_message_chunk") {
            console.log("[ACP] CHUNK:", JSON.stringify(params.update));
          }
          if (updateType === "available_commands_update") {
            const update = params.update as {
              availableCommands: AvailableCommand[];
            };
            if (this.sessionMetadata) {
              this.sessionMetadata.commands = update.availableCommands;
            } else {
              this.pendingCommands = update.availableCommands;
            }
            console.log(
              "[ACP] Commands updated:",
              update.availableCommands.length
            );
          }
          try {
            this.sessionUpdateListeners.forEach((cb) => cb(params));
          } catch (error) {
            console.error("[ACP] Error in session update listener:", error);
          }
        },
      };

      this.connection = new ClientSideConnection(() => client, stream);

      const initResponse = await this.connection.initialize({
        protocolVersion: 1,
        clientCapabilities: {},
        clientInfo: {
          name: "nexus",
          version: "0.0.1",
        },
      });

      // Final check: verify process didn't exit during initialization
      if (processExited) {
        throw new Error(
          `Agent process exited during initialization (code: ${exitCode}). ` +
            `The agent may have encountered an error.`
        );
      }

      this.setState("connected");
      return initResponse;
    } catch (error) {
      this.setState("error");
      // Clean up if process is still running
      if (this.process && !processExited) {
        this.process.kill();
        this.process = null;
      }
      this.connection = null;
      throw error;
    }
  }

  async newSession(workingDirectory: string): Promise<NewSessionResponse> {
    if (!this.connection) {
      throw new Error("Not connected");
    }

    const response = await this.connection.newSession({
      cwd: workingDirectory,
      mcpServers: [],
    });

    this.currentSessionId = response.sessionId;
    this.sessionMetadata = {
      modes: response.modes ?? null,
      models: response.models ?? null,
      commands: this.pendingCommands,
    };
    this.pendingCommands = null;

    return response;
  }

  getSessionMetadata(): SessionMetadata | null {
    return this.sessionMetadata;
  }

  async setMode(modeId: string): Promise<void> {
    if (!this.connection || !this.currentSessionId) {
      throw new Error("No active session");
    }

    await this.connection.setSessionMode({
      sessionId: this.currentSessionId,
      modeId,
    });

    if (this.sessionMetadata?.modes) {
      this.sessionMetadata.modes.currentModeId = modeId;
    }
  }

  async setModel(modelId: string): Promise<void> {
    if (!this.connection || !this.currentSessionId) {
      throw new Error("No active session");
    }

    await this.connection.unstable_setSessionModel({
      sessionId: this.currentSessionId,
      modelId,
    });

    if (this.sessionMetadata?.models) {
      this.sessionMetadata.models.currentModelId = modelId;
    }
  }

  async sendMessage(content: string | ContentBlock[]): Promise<PromptResponse> {
    if (!this.connection || !this.currentSessionId) {
      throw new Error("No active session");
    }

    // Convert string to ContentBlock array if needed
    const prompt: ContentBlock[] =
      typeof content === "string" ? [{ type: "text", text: content }] : content;

    try {
      const response = await this.connection.prompt({
        sessionId: this.currentSessionId,
        prompt,
      });
      console.log("[ACP] Prompt completed:", JSON.stringify(response, null, 2));
      return response;
    } catch (error) {
      console.error("[ACP] Prompt error:", error);
      if (error instanceof Error) {
        console.error("[ACP] Error details:", error.message, error.stack);
      }
      console.error("[ACP] Raw error:", JSON.stringify(error, null, 2));
      throw error;
    }
  }

  async cancel(): Promise<void> {
    if (!this.connection || !this.currentSessionId) {
      return;
    }

    await this.connection.cancel({
      sessionId: this.currentSessionId,
    });
  }

  dispose(): void {
    // Increment processId to invalidate old exit/error handlers
    this.processId++;
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
    this.connection = null;
    this.currentSessionId = null;
    this.sessionMetadata = null;
    this.pendingCommands = null;
    this.setState("disconnected");
  }

  private setState(state: ACPConnectionState): void {
    if (this.state !== state) {
      this.state = state;
      this.stateChangeListeners.forEach((cb) => cb(state));
    }
  }
}
