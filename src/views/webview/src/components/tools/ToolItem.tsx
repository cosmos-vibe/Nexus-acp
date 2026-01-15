import { memo, useMemo } from "react";
import type { Tool as ToolTypeFromTypes } from "@/types";
import { hasAnsiCodes, detectToolKindFromName } from "@/lib/ansi";
import { AnsiRenderer } from "./AnsiRenderer";
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
  type ToolState,
} from "@/components/ai/tool";

interface ToolItemProps {
  id: string;
  tool: ToolTypeFromTypes;
  defaultExpanded?: boolean;
}

// Map our tool status to shadcn Tool state
function mapStatus(status: ToolTypeFromTypes["status"]): ToolState {
  switch (status) {
    case "running":
      return "running";
    case "completed":
      return "completed";
    case "failed":
      return "failed";
    default:
      return "pending";
  }
}

export const ToolItem = memo(function ToolItem({
  id,
  tool,
  defaultExpanded = false,
}: ToolItemProps) {
  // Auto-detect kind from tool name if not explicitly set
  const effectiveKind = useMemo(
    () => detectToolKindFromName(tool.name, tool.kind),
    [tool.name, tool.kind]
  );

  const truncatedOutput = tool.output
    ? tool.output.length > 1000
      ? tool.output.slice(0, 1000) + "\n... (truncated)"
      : tool.output
    : null;

  const showAnsi = truncatedOutput && hasAnsiCodes(truncatedOutput);

  // Parse input for display
  const parsedInput = useMemo(() => {
    if (!tool.input) return null;
    try {
      return JSON.parse(tool.input);
    } catch {
      return tool.input;
    }
  }, [tool.input]);

  return (
    <Tool defaultOpen={defaultExpanded}>
      <ToolHeader
        name={tool.name}
        state={mapStatus(tool.status)}
      />
      <ToolContent>
        {tool.input && (
          <ToolInput input={parsedInput} />
        )}
        {truncatedOutput && (
          showAnsi ? (
            <div className="space-y-1.5 px-3 pb-3">
              <h4 className="font-medium text-muted-foreground text-[10px] uppercase tracking-wider">
                Output
              </h4>
              <div className="overflow-x-auto rounded-md bg-[#1e1e1e] p-2 text-xs font-mono max-h-[200px] overflow-y-auto">
                <AnsiRenderer text={truncatedOutput} />
              </div>
            </div>
          ) : (
            <ToolOutput output={truncatedOutput} />
          )
        )}
      </ToolContent>
    </Tool>
  );
});
