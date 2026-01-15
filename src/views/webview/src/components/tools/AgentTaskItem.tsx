import { memo, useMemo } from "react";
import type { Tool } from "@/types";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Bot,
  Wrench,
  BookOpen,
  Search,
  Compass,
  Brain,
  FileText,
  Eye,
  Layers,
  Users,
  Code,
  Sparkles,
  Terminal,
  Database,
} from "lucide-react";
import { ToolItem } from "./ToolItem";
import {
  Task,
  TaskTrigger,
  TaskContent,
  TaskItem as TaskItemUI,
} from "@/components/ai/task";

interface AgentTaskItemProps {
  id: string;
  tool: Tool;
  defaultExpanded?: boolean;
  depth?: number;
}

// Agent type icons
// Supports: Claude Code, OpenCode/Crush, Gemini CLI agents
function getAgentIcon(agentType?: string) {
  const type = agentType?.toLowerCase() || "";

  // Claude Code agents
  if (type === "librarian") return BookOpen;
  if (type === "explore" || type === "explorer") return Compass;
  if (type === "oracle") return Brain;
  if (type === "document-writer") return FileText;
  if (type === "multimodal-looker") return Eye;
  if (type === "frontend-engineer") return Layers;
  if (type === "orchestrator" || type === "orchestrator-sisyphus") return Users;
  if (type === "sisyphus-junior") return Wrench;
  if (type === "metis" || type === "momus" || type === "prometheus") return Brain;

  // OpenCode/Crush agents
  if (type === "coder" || type === "code") return Code;
  if (type === "task") return Wrench;
  if (type === "title") return FileText;
  if (type === "summarizer") return FileText;

  // Gemini CLI (uses extensions/skills, not sub-agents)
  if (type === "conductor") return Sparkles;
  if (type === "shell" || type === "bash") return Terminal;

  // Generic patterns
  if (type.includes("search") || type.includes("find")) return Search;
  if (type.includes("code") || type.includes("dev")) return Code;
  if (type.includes("doc") || type.includes("write")) return FileText;
  if (type.includes("data") || type.includes("db")) return Database;

  return Bot;
}

// Agent type colors
function getAgentColor(agentType?: string): string {
  const type = agentType?.toLowerCase() || "";

  // Claude Code agents
  if (type === "librarian") return "text-amber-500";
  if (type === "explore" || type === "explorer") return "text-emerald-500";
  if (type === "oracle" || type === "metis" || type === "momus" || type === "prometheus") return "text-purple-500";
  if (type === "document-writer") return "text-blue-500";
  if (type === "multimodal-looker") return "text-pink-500";
  if (type === "frontend-engineer") return "text-cyan-500";
  if (type === "orchestrator" || type === "orchestrator-sisyphus") return "text-orange-500";
  if (type === "sisyphus-junior") return "text-slate-500";

  // OpenCode/Crush agents
  if (type === "coder" || type === "code") return "text-indigo-500";
  if (type === "task") return "text-teal-500";
  if (type === "title" || type === "summarizer") return "text-rose-500";

  // Gemini CLI
  if (type === "conductor") return "text-violet-500";
  if (type === "shell" || type === "bash") return "text-lime-500";

  // Generic patterns
  if (type.includes("search") || type.includes("find")) return "text-emerald-500";
  if (type.includes("code") || type.includes("dev")) return "text-indigo-500";
  if (type.includes("doc") || type.includes("write")) return "text-blue-500";

  return "text-blue-500";
}

export const AgentTaskItem = memo(function AgentTaskItem({
  id,
  tool,
  defaultExpanded = false,
  depth = 0,
}: AgentTaskItemProps) {
  const AgentIcon = getAgentIcon(tool.agentType);
  const agentColor = getAgentColor(tool.agentType);

  // Count sub-tools
  const subToolIds = useMemo(() => {
    return tool.subTools ? Object.keys(tool.subTools) : [];
  }, [tool.subTools]);

  const subToolStats = useMemo(() => {
    if (!tool.subTools) return { total: 0, running: 0, completed: 0, failed: 0 };
    const tools = Object.values(tool.subTools);
    return {
      total: tools.length,
      running: tools.filter((t) => t.status === "running").length,
      completed: tools.filter((t) => t.status === "completed").length,
      failed: tools.filter((t) => t.status === "failed").length,
    };
  }, [tool.subTools]);

  const hasSubTools = subToolIds.length > 0;

  // Status icon
  const StatusIcon = () => {
    if (tool.status === "completed") {
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    }
    if (tool.status === "failed") {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
  };

  // Extract agent name from tool description or input
  const agentDisplayName = useMemo(() => {
    if (tool.agentType) {
      return tool.agentType.charAt(0).toUpperCase() + tool.agentType.slice(1);
    }
    if (tool.input) {
      const match = tool.input.match(/subagent_type["\s:]+(\w+)/i);
      if (match) {
        return match[1].charAt(0).toUpperCase() + match[1].slice(1);
      }
    }
    return "Agent";
  }, [tool.agentType, tool.input]);

  // Extract task description
  const taskDescription = useMemo(() => {
    if (tool.description) return tool.description;
    if (tool.input) {
      const descMatch = tool.input.match(/description["\s:]+["']?([^"'\n]+)/i);
      if (descMatch) return descMatch[1];
      const promptMatch = tool.input.match(/prompt["\s:]+["']?([^"'\n]+)/i);
      if (promptMatch) {
        const prompt = promptMatch[1];
        return prompt.length > 80 ? prompt.slice(0, 80) + "..." : prompt;
      }
    }
    return null;
  }, [tool.description, tool.input]);

  // Build title with status
  const taskTitle = useMemo(() => {
    let title = agentDisplayName;
    if (hasSubTools) {
      title += ` (${subToolStats.completed}/${subToolStats.total})`;
    }
    return title;
  }, [agentDisplayName, hasSubTools, subToolStats]);

  return (
    <Task defaultOpen={defaultExpanded} className={cn(depth > 0 && "ml-4")}>
      <TaskTrigger title={taskTitle}>
        <div className="flex w-full cursor-pointer items-center gap-2 text-sm transition-colors hover:text-foreground">
          <AgentIcon className={cn("size-4", agentColor)} />
          <span className={cn("font-medium", agentColor)}>{agentDisplayName}</span>
          <StatusIcon />
          {hasSubTools && (
            <span className="text-xs text-muted-foreground">
              {subToolStats.completed}/{subToolStats.total} tools
            </span>
          )}
          {subToolStats.running > 0 && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-xs ml-auto">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              {subToolStats.running}
            </span>
          )}
        </div>
      </TaskTrigger>
      <TaskContent>
        {/* Task description */}
        {taskDescription && (
          <TaskItemUI>
            {taskDescription}
          </TaskItemUI>
        )}

        {/* Sub-tools */}
        {hasSubTools && (
          <div className="space-y-2 mt-2">
            {subToolIds.map((subId) => {
              const subTool = tool.subTools![subId];
              // Check if sub-tool is also a Task (nested agents)
              if (subTool.kind === "task" || subTool.kind === "agent") {
                return (
                  <AgentTaskItem
                    key={subId}
                    id={subId}
                    tool={subTool}
                    depth={depth + 1}
                  />
                );
              }
              return <ToolItem key={subId} id={subId} tool={subTool} />;
            })}
          </div>
        )}

        {/* Show output if no sub-tools but has output */}
        {!hasSubTools && tool.output && (
          <div className="mt-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block mb-1">
              Result
            </span>
            <pre className="text-xs font-mono bg-muted/50 rounded-md p-2 overflow-x-auto max-h-[200px] overflow-y-auto whitespace-pre-wrap break-words">
              {tool.output.length > 500
                ? tool.output.slice(0, 500) + "\n... (truncated)"
                : tool.output}
            </pre>
          </div>
        )}
      </TaskContent>
    </Task>
  );
});
