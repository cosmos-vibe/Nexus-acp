export type ToolKind =
  | "read"
  | "edit"
  | "write"
  | "delete"
  | "move"
  | "search"
  | "execute"
  | "think"
  | "fetch"
  | "switch_mode"
  | "task" // Task agent delegation
  | "agent" // Sub-agent spawning
  | "parallel" // Parallel execution indicator
  | "todo" // Todo management
  | "question" // AskUserQuestion
  | "plan" // Planning mode
  | "notebook" // Jupyter notebook
  | "other";

export const TOOL_KIND_ICONS: Record<ToolKind, string> = {
  read: "📖",
  edit: "✏️",
  write: "📝",
  delete: "🗑️",
  move: "📦",
  search: "🔍",
  execute: "▶️",
  think: "🧠",
  fetch: "🌐",
  switch_mode: "🔄",
  task: "📋", // Task delegation
  agent: "🤖", // Sub-agent
  parallel: "⚡", // Parallel execution
  todo: "✅", // Todo management
  question: "❓", // AskUserQuestion
  plan: "📐", // Planning mode
  notebook: "📓", // Jupyter notebook
  other: "⚙️",
};

// Patterns to detect parallel/multi-agent operations from tool names
export const PARALLEL_TOOL_PATTERNS = [
  /^Task$/i, // Task tool
  /agent/i, // Any agent-related
  /parallel/i, // Explicit parallel
  /background/i, // Background execution
  /spawn/i, // Spawn sub-process
  /delegate/i, // Delegation
  /concurrent/i, // Concurrent execution
  /sisyphus/i, // Sisyphus multi-agent
  /oracle|librarian|explore/i, // Known sub-agents
];

export function detectToolKindFromName(
  name: string,
  existingKind?: ToolKind
): ToolKind {
  if (existingKind && existingKind !== "other") return existingKind;

  // Check for parallel/agent patterns
  if (PARALLEL_TOOL_PATTERNS.some((pattern) => pattern.test(name))) {
    if (/^Task$/i.test(name)) return "task";
    if (/agent|oracle|librarian|explore/i.test(name)) return "agent";
    return "parallel";
  }

  // ============================================
  // FILE READ OPERATIONS
  // Claude Code: Read, NotebookRead
  // OpenCode: view
  // Gemini: read_file, ReadFile
  // ============================================
  if (/^read$/i.test(name) || /^view$/i.test(name)) return "read";
  if (/^read_file$/i.test(name) || /^readfile$/i.test(name)) return "read";
  if (/^notebookread$/i.test(name)) return "read";

  // ============================================
  // FILE EDIT OPERATIONS
  // Claude Code: Edit, MultiEdit
  // OpenCode: edit, patch
  // Gemini: replace, Edit
  // ============================================
  if (/^edit$/i.test(name) || /^multiedit$/i.test(name)) return "edit";
  if (/^patch$/i.test(name) || /^replace$/i.test(name)) return "edit";

  // ============================================
  // FILE WRITE OPERATIONS
  // Claude Code: Write, NotebookEdit
  // OpenCode: write
  // Gemini: write_file, WriteFile
  // ============================================
  if (/^write$/i.test(name) || /^write_file$/i.test(name)) return "write";
  if (/^writefile$/i.test(name) || /^notebookedit$/i.test(name)) return "write";

  // ============================================
  // SEARCH OPERATIONS
  // Claude Code: Glob, Grep, LS
  // OpenCode: glob, grep, ls, sourcegraph
  // Gemini: glob, FindFiles, list_directory, ReadFolder, search_file_content, SearchText
  // ============================================
  if (/^glob$/i.test(name) || /^grep$/i.test(name) || /^ls$/i.test(name))
    return "search";
  if (/^findfiles$/i.test(name) || /^list_directory$/i.test(name))
    return "search";
  if (/^readfolder$/i.test(name) || /^search_file_content$/i.test(name))
    return "search";
  if (/^searchtext$/i.test(name) || /^sourcegraph$/i.test(name))
    return "search";
  if (/search/i.test(name)) return "search";

  // ============================================
  // SHELL/EXECUTE OPERATIONS
  // Claude Code: Bash, BashOutput, KillShell
  // OpenCode: bash
  // Gemini: run_shell_command
  // ============================================
  if (/^bash$/i.test(name) || /^bashoutput$/i.test(name)) return "execute";
  if (/^killshell$/i.test(name) || /^run_shell_command$/i.test(name))
    return "execute";
  if (/shell|command/i.test(name)) return "execute";

  // ============================================
  // WEB/FETCH OPERATIONS
  // Claude Code: WebFetch, WebSearch
  // OpenCode: fetch
  // Gemini: web_fetch, google_web_search
  // ============================================
  if (/^webfetch$/i.test(name) || /^websearch$/i.test(name)) return "fetch";
  if (/^fetch$/i.test(name) || /^web_fetch$/i.test(name)) return "fetch";
  if (/^google_web_search$/i.test(name)) return "fetch";

  // ============================================
  // TODO/MEMORY OPERATIONS
  // Claude Code: TodoWrite, TodoRead
  // Gemini: write_todos, save_memory
  // ============================================
  if (/^todo/i.test(name)) return "todo";
  if (/^write_todos$/i.test(name) || /^save_memory$/i.test(name)) return "todo";
  if (/memory/i.test(name)) return "todo";

  // ============================================
  // QUESTION/INTERACTION
  // Claude Code: AskUserQuestion
  // ============================================
  if (/^askuserquestion$/i.test(name)) return "question";
  if (/question|ask/i.test(name)) return "question";

  // ============================================
  // PLANNING MODE
  // Claude Code: EnterPlanMode, ExitPlanMode
  // ============================================
  if (/planmode$/i.test(name)) return "plan";

  // ============================================
  // NOTEBOOK OPERATIONS
  // Claude Code: NotebookRead, NotebookEdit
  // ============================================
  if (/^notebook/i.test(name)) return "notebook";

  // ============================================
  // DIAGNOSTICS (OpenCode)
  // ============================================
  if (/^diagnostics$/i.test(name)) return "other";

  // ============================================
  // SKILLS (Gemini)
  // ============================================
  if (/^activate-skill$/i.test(name) || /^get-internal-docs$/i.test(name))
    return "other";

  return existingKind || "other";
}

export function getToolKindIcon(kind?: ToolKind): string {
  return kind ? TOOL_KIND_ICONS[kind] || TOOL_KIND_ICONS.other : "";
}

const ANSI_FOREGROUND: Record<number, string> = {
  30: "text-ansi-black",
  31: "text-ansi-red",
  32: "text-ansi-green",
  33: "text-ansi-yellow",
  34: "text-ansi-blue",
  35: "text-ansi-magenta",
  36: "text-ansi-cyan",
  37: "text-ansi-white",
  90: "text-ansi-bright-black",
  91: "text-ansi-bright-red",
  92: "text-ansi-bright-green",
  93: "text-ansi-bright-yellow",
  94: "text-ansi-bright-blue",
  95: "text-ansi-bright-magenta",
  96: "text-ansi-bright-cyan",
  97: "text-ansi-bright-white",
};

const ANSI_BACKGROUND: Record<number, string> = {
  40: "bg-ansi-black",
  41: "bg-ansi-red",
  42: "bg-ansi-green",
  43: "bg-ansi-yellow",
  44: "bg-ansi-blue",
  45: "bg-ansi-magenta",
  46: "bg-ansi-cyan",
  47: "bg-ansi-white",
  100: "bg-ansi-bright-black",
  101: "bg-ansi-bright-red",
  102: "bg-ansi-bright-green",
  103: "bg-ansi-bright-yellow",
  104: "bg-ansi-bright-blue",
  105: "bg-ansi-bright-magenta",
  106: "bg-ansi-bright-cyan",
  107: "bg-ansi-bright-white",
};

const ANSI_STYLES: Record<number, string> = {
  1: "ansi-bold",
  2: "ansi-dim",
  3: "ansi-italic",
  4: "ansi-underline",
};

const ANSI_ESCAPE_REGEX = /\x1b\[([0-9;]*)m/g;

function isForegroundClass(cls: string): boolean {
  return cls.startsWith("text-ansi-");
}

function isBackgroundClass(cls: string): boolean {
  return cls.startsWith("bg-ansi-");
}

export interface AnsiSegment {
  text: string;
  classes: string[];
}

export function parseAnsi(text: string): AnsiSegment[] {
  const segments: AnsiSegment[] = [];
  let lastIndex = 0;
  let currentClasses: string[] = [];
  let match: RegExpExecArray | null;

  ANSI_ESCAPE_REGEX.lastIndex = 0;

  while ((match = ANSI_ESCAPE_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const textContent = text.slice(lastIndex, match.index);
      segments.push({
        text: textContent,
        classes: [...currentClasses],
      });
    }

    const codes = match[1].split(";").map((c) => parseInt(c, 10) || 0);

    for (const code of codes) {
      if (code === 0) {
        currentClasses = [];
      } else if (ANSI_STYLES[code]) {
        const styleClass = ANSI_STYLES[code];
        if (!currentClasses.includes(styleClass)) {
          currentClasses.push(styleClass);
        }
      } else if (ANSI_FOREGROUND[code]) {
        currentClasses = currentClasses.filter((c) => !isForegroundClass(c));
        currentClasses.push(ANSI_FOREGROUND[code]);
      } else if (ANSI_BACKGROUND[code]) {
        currentClasses = currentClasses.filter((c) => !isBackgroundClass(c));
        currentClasses.push(ANSI_BACKGROUND[code]);
      }
    }

    lastIndex = match.index + match[0].length;
  }

  ANSI_ESCAPE_REGEX.lastIndex = 0;

  if (lastIndex < text.length) {
    const textContent = text.slice(lastIndex);
    segments.push({
      text: textContent,
      classes: [...currentClasses],
    });
  }

  return segments;
}

export function hasAnsiCodes(text: string): boolean {
  return /\x1b\[[0-9;]*m/.test(text);
}
