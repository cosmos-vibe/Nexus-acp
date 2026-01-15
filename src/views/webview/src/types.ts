import type { ToolKind } from "./lib/ansi";

// 첨부 파일 타입
export type AttachmentType = "file" | "image" | "code";

export interface Attachment {
  id: string;
  type: AttachmentType;
  name: string;
  content: string; // Base64 for images, text for code/files
  path?: string; // 파일 경로 (있으면)
  language?: string; // 코드 언어 (code 타입일 때)
  lineRange?: [number, number]; // 코드 라인 범위
  mimeType?: string; // 이미지 MIME 타입
}

export interface Tool {
  name: string;
  input: string | null;
  output: string | null;
  status: "running" | "completed" | "failed";
  kind?: ToolKind;
  // For Task/Agent tools - hierarchical structure
  agentType?: string; // e.g., "librarian", "explore", "oracle"
  description?: string; // Short description of what the agent is doing
  subTools?: Record<string, Tool>; // Tools used by sub-agents
  progress?: {
    total?: number;
    completed?: number;
  };
}

export interface Agent {
  id: string;
  name: string;
  available: boolean;
}

export interface Mode {
  id: string;
  name: string;
}

export interface Model {
  modelId: string;
  name: string;
}

export interface AvailableCommand {
  name: string;
  description?: string;
  input?: { hint?: string };
}

export interface PlanEntry {
  content: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in_progress" | "completed";
}

export interface Message {
  id: string;
  type: "user" | "assistant" | "error" | "system";
  text: string;
  html?: string;
  tools?: Record<string, Tool>;
  timestamp: number;
  attachments?: Attachment[]; // 첨부 파일 (이미지 등)
}

export interface WebviewState {
  isConnected: boolean;
  inputValue: string;
}

// Session storage type (matches extension)
export interface StoredSession {
  id: string;
  title: string;
  agentId: string;
  timestamp: number;
  messages: Message[];
}

// thinkingChunk 메시지: { type: "thinkingChunk", text: string }
// thinkingEnd 메시지: { type: "thinkingEnd" }

export interface ExtensionMessage {
  type: string;
  text?: string;
  html?: string;
  state?: string;
  agents?: Agent[];
  selected?: string;
  agentId?: string;
  modeId?: string;
  modelId?: string;
  modes?: {
    availableModes: Mode[];
    currentModeId: string;
  } | null;
  models?: {
    availableModels: Model[];
    currentModelId: string;
  } | null;
  commands?: AvailableCommand[] | null;
  plan?: { entries: PlanEntry[] };
  toolCallId?: string;
  name?: string;
  title?: string;
  kind?: ToolKind;
  content?: Array<{ content?: { text?: string } }>;
  rawInput?: {
    command?: string;
    description?: string;
    subagent_type?: string;
    prompt?: string;
  };
  rawOutput?: { output?: string };
  status?: string;
  attachments?: Attachment[]; // 이미지 등 첨부파일
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  files?: any[]; // filesAttached용
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  code?: any; // codeAttached용
  sessions?: StoredSession[]; // session history
}
