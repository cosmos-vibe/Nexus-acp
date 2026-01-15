import { memo } from "react";
import type { AvailableCommand } from "@/types";
import { cn } from "@/lib/utils";

interface CommandAutocompleteProps {
  commands: AvailableCommand[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onHover: (index: number) => void;
  visible: boolean;
}

export const CommandAutocomplete = memo(function CommandAutocomplete({
  commands,
  selectedIndex,
  onSelect,
  onHover,
  visible,
}: CommandAutocompleteProps) {
  if (!visible || commands.length === 0) return null;

  return (
    <div
      className="absolute bottom-full left-3 right-3 mb-1 bg-dropdown border border-dropdown-border rounded-md shadow-lg max-h-60 overflow-y-auto z-50 animate-slide-up"
      role="listbox"
    >
      {commands.map((cmd, index) => (
        <div
          key={cmd.name}
          className={cn(
            "px-3 py-2 cursor-pointer flex flex-col gap-0.5 border-b border-dropdown-border last:border-b-0",
            index === selectedIndex
              ? "bg-list-active text-list-activeForeground"
              : "hover:bg-list-hover"
          )}
          role="option"
          aria-selected={index === selectedIndex}
          data-index={index}
          onClick={() => onSelect(index)}
          onMouseEnter={() => onHover(index)}
        >
          <div className="font-mono font-semibold text-sm">
            <span className="opacity-60">/</span>
            {cmd.name}
          </div>
          {cmd.description && (
            <div
              className={cn(
                "text-xs",
                index === selectedIndex
                  ? "opacity-80"
                  : "text-muted-foreground opacity-90"
              )}
            >
              {cmd.description}
            </div>
          )}
          {cmd.input?.hint && (
            <div
              className={cn(
                "text-[10px] italic mt-0.5",
                index === selectedIndex
                  ? "opacity-60"
                  : "text-muted-foreground opacity-70"
              )}
            >
              {cmd.input.hint}
            </div>
          )}
        </div>
      ))}
    </div>
  );
});
