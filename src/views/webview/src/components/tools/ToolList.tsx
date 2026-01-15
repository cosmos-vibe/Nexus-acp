import { memo, useState, useMemo } from "react";
import type { Tool } from "@/types";
import { ToolItem } from "./ToolItem";
import { AgentTaskItem } from "./AgentTaskItem";
import { detectToolKindFromName } from "@/lib/ansi";
import { cn } from "@/lib/utils";
import { Wrench, ChevronDown, Bot } from "lucide-react";

interface ToolListProps {
  tools: Record<string, Tool>;
  expandedToolId?: string | null;
}

const MAX_VISIBLE_TOOLS = 5;

export const ToolList = memo(function ToolList({
  tools,
  expandedToolId,
}: ToolListProps) {
  const toolIds = Object.keys(tools);
  const [showAll, setShowAll] = useState(false);

  if (toolIds.length === 0) return null;

  // Separate agent tasks from regular tools
  const { agentToolIds, regularToolIds } = useMemo(() => {
    const agents: string[] = [];
    const regular: string[] = [];

    toolIds.forEach((id) => {
      const tool = tools[id];
      const kind = tool.kind || detectToolKindFromName(tool.name);
      if (kind === "task" || kind === "agent" || tool.name === "Task") {
        agents.push(id);
      } else {
        regular.push(id);
      }
    });

    return { agentToolIds: agents, regularToolIds: regular };
  }, [toolIds, tools]);

  // Count running tools
  const runningCount = toolIds.filter(id => tools[id].status === "running").length;
  const completedCount = toolIds.filter(id => tools[id].status === "completed").length;
  const failedCount = toolIds.filter(id => tools[id].status === "failed").length;
  const agentCount = agentToolIds.length;

  // Determine which regular tools to show (agents are always shown)
  const hiddenCount = regularToolIds.length - MAX_VISIBLE_TOOLS;

  return (
    <div className="space-y-2 overflow-hidden">
      {/* Header with stats */}
      <div className="flex items-center gap-3 text-sm flex-wrap">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Wrench className="h-4 w-4" />
          <span className="font-medium">{toolIds.length} tool{toolIds.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 text-xs">
          {agentCount > 0 && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-500">
              <Bot className="h-3 w-3" />
              {agentCount} agent{agentCount !== 1 ? "s" : ""}
            </span>
          )}
          {runningCount > 0 && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              {runningCount} running
            </span>
          )}
          {completedCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
              {completedCount} done
            </span>
          )}
          {failedCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500">
              {failedCount} failed
            </span>
          )}
        </div>
      </div>

      {/* Agent tasks section - shown first */}
      {agentToolIds.length > 0 && (
        <div className="space-y-2 overflow-hidden">
          {agentToolIds.map((id) => (
            <AgentTaskItem
              key={id}
              id={id}
              tool={tools[id]}
              defaultExpanded={id === expandedToolId}
            />
          ))}
        </div>
      )}

      {/* Regular tools section */}
      {regularToolIds.length > 0 && (
        <div className="space-y-2 overflow-hidden">
          {(showAll ? regularToolIds : regularToolIds.slice(0, MAX_VISIBLE_TOOLS)).map((id) => (
            <ToolItem
              key={id}
              id={id}
              tool={tools[id]}
              defaultExpanded={id === expandedToolId}
            />
          ))}
        </div>
      )}

      {/* Show more/less button */}
      {hiddenCount > 0 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className={cn(
            "w-full flex items-center justify-center gap-1.5 py-2 text-xs text-muted-foreground",
            "rounded-lg border border-dashed border-border/50 hover:border-border hover:bg-muted/30",
            "transition-colors duration-200"
          )}
        >
          <ChevronDown className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            showAll && "rotate-180"
          )} />
          {showAll ? "Show less" : `Show ${hiddenCount} more tool${hiddenCount !== 1 ? "s" : ""}`}
        </button>
      )}
    </div>
  );
});
