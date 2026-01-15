import { useMemo } from "react";
import { useChatStore } from "@/store";
import { ToolList } from "@/components/tools/ToolList";
import { Markdown } from "@/components/ui/markdown";
import { PARALLEL_TOOL_PATTERNS } from "@/lib/ansi";

// Detect if we have parallel/multi-agent activity
function analyzeParallelActivity(tools: Record<string, { name: string; status: string }>) {
  const toolEntries = Object.entries(tools);
  const runningTools = toolEntries.filter(([, t]) => t.status === "running");

  // Check for parallel patterns
  const hasParallelTool = toolEntries.some(([, t]) =>
    PARALLEL_TOOL_PATTERNS.some((p) => p.test(t.name))
  );

  // Multiple running tools = parallel execution
  const isParallel = runningTools.length > 1 || hasParallelTool;

  // Detect agent names
  const agentPattern = /\[(.*?)\]|agent[:\s]+(\w+)/i;
  const agents = new Set<string>();
  toolEntries.forEach(([, t]) => {
    const match = t.name.match(agentPattern);
    if (match) agents.add(match[1] || match[2]);
    // Also check for known agent types
    if (/oracle|librarian|explore|sisyphus|frontend/i.test(t.name)) {
      const agentMatch = t.name.match(/oracle|librarian|explore|sisyphus|frontend/i);
      if (agentMatch) agents.add(agentMatch[0]);
    }
  });

  return {
    isParallel,
    runningCount: runningTools.length,
    totalCount: toolEntries.length,
    agents: Array.from(agents),
  };
}

export function StreamingMessage() {
  const { streaming, isThinking } = useChatStore();

  const parallelInfo = useMemo(
    () => analyzeParallelActivity(streaming.tools),
    [streaming.tools]
  );

  // Don't show if we're just thinking (no text yet)
  if (!streaming.currentText && isThinking) {
    return null;
  }

  // Don't show if there's nothing to show
  if (!streaming.currentText && Object.keys(streaming.tools).length === 0) {
    return null;
  }

  return (
    <div
      className="mx-auto w-full max-w-thread px-2 py-4 animate-slide-in"
      role="article"
      aria-label="Agent response"
      data-role="assistant"
    >
      <div className="mx-2 leading-7 text-foreground break-words">
        {streaming.currentText && (
          <Markdown content={streaming.currentText} />
        )}

        {Object.keys(streaming.tools).length > 0 && (
          <div className="mt-4">
            {/* Parallel/Multi-agent indicator */}
            {parallelInfo.isParallel && parallelInfo.runningCount > 0 && (
              <div className="mb-2 flex items-center gap-2 px-2 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs">
                <span className="flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="font-medium text-primary">
                    {parallelInfo.runningCount > 1
                      ? `${parallelInfo.runningCount} parallel tasks`
                      : "Background task"}
                  </span>
                </span>
                {parallelInfo.agents.length > 0 && (
                  <span className="text-muted-foreground">
                    • {parallelInfo.agents.map((a) => `🤖 ${a}`).join(" ")}
                  </span>
                )}
              </div>
            )}
            <ToolList
              tools={streaming.tools}
              expandedToolId={streaming.expandedToolId}
            />
          </div>
        )}
      </div>
    </div>
  );
}
