import { useMemo, useRef, useEffect, memo } from "react";
import { useChatStore } from "@/store";
import { useShallow } from "zustand/react/shallow";
import { ToolList } from "@/components/tools/ToolList";
import {
  ChainOfThought,
  ChainOfThoughtHeader,
  ChainOfThoughtContent,
  ChainOfThoughtStep,
} from "@/components/ai/chain-of-thought";
import { BrainIcon, FileSearchIcon, PencilIcon, TerminalIcon } from "lucide-react";

const MAX_THINKING_DISPLAY = 5000;

export const ThinkingIndicator = memo(function ThinkingIndicator() {
  // Subscribe to primitive values individually
  const isThinking = useChatStore((state) => state.isThinking);
  const thinkingText = useChatStore((state) => state.streaming.thinkingText);
  const expandedToolId = useChatStore((state) => state.streaming.expandedToolId);

  // Use shallow comparison for objects to avoid unnecessary re-renders
  const tools = useChatStore(useShallow((state) => state.streaming.tools));

  // Debug: track render count (remove in production)
  const renderCount = useRef(0);
  renderCount.current++;

  useEffect(() => {
    console.log(`[DEBUG] ThinkingIndicator render #${renderCount.current}, isThinking: ${isThinking}, thinkingText: ${thinkingText.length} chars, tools: ${Object.keys(tools).length}`);
  });

  // Memoize truncated thinking text
  const displayText = useMemo(() => {
    if (thinkingText.length <= MAX_THINKING_DISPLAY) {
      return thinkingText;
    }
    return "..." + thinkingText.slice(-MAX_THINKING_DISPLAY);
  }, [thinkingText]);

  // Get tool stats for step display
  const toolStats = useMemo(() => {
    const toolList = Object.values(tools);
    const running = toolList.filter((t) => t.status === "running").length;
    const completed = toolList.filter((t) => t.status === "completed").length;
    const total = toolList.length;

    // Get last active tool types for display
    const activeToolTypes = toolList
      .filter((t) => t.status === "running")
      .map((t) => t.kind || "other")
      .slice(0, 3);

    return { running, completed, total, activeToolTypes };
  }, [tools]);

  if (!isThinking) return null;

  const hasThinkingText = thinkingText.length > 0;
  const hasTools = Object.keys(tools).length > 0;
  const isStreaming = hasThinkingText;

  return (
    <div
      className="mx-auto w-full max-w-thread px-2 py-4 animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-hidden"
      role="status"
      aria-label="Agent is thinking"
      data-role="assistant"
    >
      <div className="mx-2 space-y-4 overflow-hidden">
        <ChainOfThought defaultOpen={hasThinkingText}>
          {/* Header */}
          <ChainOfThoughtHeader>
            {isStreaming ? (
              <span className="flex items-center gap-1.5">
                <span className="relative">
                  Reasoning
                  <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-blue-400/30 to-transparent bg-[length:200%_100%]">
                    Reasoning
                  </span>
                </span>
                <span className="text-xs text-muted-foreground/60">
                  ({Math.round(thinkingText.length / 1000)}k)
                </span>
              </span>
            ) : (
              "Reasoning"
            )}
          </ChainOfThoughtHeader>

          {/* Content */}
          <ChainOfThoughtContent>
            {/* Thinking step */}
            {hasThinkingText && (
              <ChainOfThoughtStep
                icon={BrainIcon}
                label="Thinking..."
                status={isStreaming ? "active" : "complete"}
              >
                <div className="whitespace-pre-wrap break-words font-mono text-xs bg-muted/30 rounded-lg p-3 max-h-48 overflow-y-auto">
                  {displayText}
                </div>
              </ChainOfThoughtStep>
            )}

            {/* Tool execution steps */}
            {toolStats.running > 0 && (
              <ChainOfThoughtStep
                icon={
                  toolStats.activeToolTypes.includes("search")
                    ? FileSearchIcon
                    : toolStats.activeToolTypes.includes("edit")
                      ? PencilIcon
                      : toolStats.activeToolTypes.includes("execute")
                        ? TerminalIcon
                        : BrainIcon
                }
                label={`Executing ${toolStats.running} tool${toolStats.running > 1 ? "s" : ""}...`}
                status="active"
              />
            )}

            {toolStats.completed > 0 && toolStats.running === 0 && (
              <ChainOfThoughtStep
                icon={BrainIcon}
                label={`Completed ${toolStats.completed} tool${toolStats.completed > 1 ? "s" : ""}`}
                status="complete"
              />
            )}

            {/* Minimal loading indicator when no text yet */}
            {!hasThinkingText && !hasTools && (
              <ChainOfThoughtStep
                icon={BrainIcon}
                label={
                  <div className="flex items-center gap-2">
                    <span>Processing</span>
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" />
                    </div>
                  </div>
                }
                status="active"
              />
            )}
          </ChainOfThoughtContent>
        </ChainOfThought>

        {/* Tools Section */}
        {hasTools && (
          <div className="border-t border-border/50 pt-4 overflow-hidden">
            <ToolList tools={tools} expandedToolId={expandedToolId} />
          </div>
        )}
      </div>
    </div>
  );
});
