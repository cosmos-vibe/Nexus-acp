import { memo } from "react";
import { parseAnsi } from "@/lib/ansi";
import { cn } from "@/lib/utils";

interface AnsiRendererProps {
  text: string;
  className?: string;
}

export const AnsiRenderer = memo(function AnsiRenderer({
  text,
  className,
}: AnsiRendererProps) {
  const segments = parseAnsi(text);

  return (
    <span className={className}>
      {segments.map((segment, index) => (
        <span key={index} className={cn(segment.classes)}>
          {segment.text}
        </span>
      ))}
    </span>
  );
});
