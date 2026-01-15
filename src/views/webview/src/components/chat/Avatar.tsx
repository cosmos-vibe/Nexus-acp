import { cn } from "@/lib/utils";

interface AvatarProps {
  type: "user" | "assistant" | "error" | "system";
  className?: string;
}

export function Avatar({ type, className }: AvatarProps) {
  if (type === "error" || type === "system") {
    return null;
  }

  return (
    <div
      className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
        className
      )}
    >
      {type === "user" ? (
        <div className="w-full h-full rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
          U
        </div>
      ) : (
        <div className="w-full h-full rounded-full bg-accent text-accent-foreground flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
        </div>
      )}
    </div>
  );
}
