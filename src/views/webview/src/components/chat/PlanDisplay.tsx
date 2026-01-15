import type { PlanEntry } from "@/types";
import { cn } from "@/lib/utils";

interface PlanDisplayProps {
  entries: PlanEntry[];
}

function getPlanStatusIcon(status: string): string {
  switch (status) {
    case "completed":
      return "✓";
    case "in_progress":
      return "⋯";
    case "pending":
    default:
      return "○";
  }
}

export function PlanDisplay({ entries }: PlanDisplayProps) {
  const completedCount = entries.filter((e) => e.status === "completed").length;
  const totalCount = entries.length;

  return (
    <div
      className="my-2 p-3 bg-accent/30 rounded-lg border-l-[3px] border-l-primary"
      role="status"
      aria-live="polite"
      aria-label="Agent execution plan"
    >
      <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-border">
        <span className="text-sm">📋</span>
        <span className="font-semibold text-xs uppercase tracking-wide">
          Agent Plan
        </span>
        <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
          {completedCount}/{totalCount}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {entries.map((entry, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start gap-2 text-sm leading-relaxed py-1",
              entry.priority === "low" && "opacity-80"
            )}
          >
            <span
              className={cn(
                "flex-shrink-0 w-4 text-center text-xs",
                entry.status === "pending" && "text-muted-foreground",
                entry.status === "in_progress" &&
                  "text-warning animate-pulse",
                entry.status === "completed" && "text-success"
              )}
            >
              {getPlanStatusIcon(entry.status)}
            </span>
            <span
              className={cn(
                "flex-1",
                entry.status === "completed" &&
                  "text-muted-foreground line-through",
                entry.priority === "high" && "font-medium"
              )}
            >
              {entry.content}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
