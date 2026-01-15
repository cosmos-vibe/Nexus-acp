import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownProps {
  content: string;
  className?: string;
}

export const Markdown = memo(function Markdown({
  content,
  className = "",
}: MarkdownProps) {
  const rehypePlugins = useMemo(
    () => [rehypeSanitize, rehypeHighlight],
    []
  );

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown rehypePlugins={rehypePlugins}>{content}</ReactMarkdown>
    </div>
  );
});
