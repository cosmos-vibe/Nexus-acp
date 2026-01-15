import { X, File, Code } from "lucide-react";
import type { Attachment } from "@/types";

interface AttachmentChipProps {
  attachment: Attachment;
  onRemove: (id: string) => void;
}

export function AttachmentChip({ attachment, onRemove }: AttachmentChipProps) {
  const getIcon = () => {
    switch (attachment.type) {
      case "code":
        return <Code className="h-3.5 w-3.5" />;
      default:
        return <File className="h-3.5 w-3.5" />;
    }
  };

  const getDisplayName = () => {
    if (attachment.type === "code" && attachment.lineRange) {
      return `${attachment.name}:${attachment.lineRange[0]}-${attachment.lineRange[1]}`;
    }
    return attachment.name;
  };

  // 이미지인 경우 썸네일로 표시
  if (attachment.type === "image") {
    return (
      <div className="relative group">
        <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-border bg-muted">
          <img
            src={attachment.content}
            alt={attachment.name}
            className="h-full w-full object-cover"
          />
          <button
            onClick={() => onRemove(attachment.id)}
            className="absolute top-0.5 right-0.5 rounded-full bg-background/80 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            aria-label={`Remove ${attachment.name}`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  // 파일/코드는 기존 칩 스타일
  return (
    <div className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2 py-1 text-xs text-muted-foreground">
      {getIcon()}
      <span className="max-w-[120px] truncate" title={getDisplayName()}>
        {getDisplayName()}
      </span>
      <button
        onClick={() => onRemove(attachment.id)}
        className="ml-0.5 rounded-sm hover:bg-muted-foreground/20 p-0.5"
        aria-label={`Remove ${attachment.name}`}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
