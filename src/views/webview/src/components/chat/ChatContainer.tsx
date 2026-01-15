import { useEffect, useRef } from "react";
import { useChatStore } from "@/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { StreamingMessage } from "./StreamingMessage";
import { PlanDisplay } from "./PlanDisplay";

export function ChatContainer() {
  const { messages, streaming, isThinking, plan } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming.currentText, isThinking, plan]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const container = scrollRef.current;
    if (!container) return;

    const messageEls = container.querySelectorAll("[role='article']");
    const focused = document.activeElement;
    const currentIndex = Array.from(messageEls).indexOf(focused as Element);

    if (e.key === "ArrowDown" && currentIndex < messageEls.length - 1) {
      e.preventDefault();
      (messageEls[currentIndex + 1] as HTMLElement).focus();
    } else if (e.key === "ArrowUp" && currentIndex > 0) {
      e.preventDefault();
      (messageEls[currentIndex - 1] as HTMLElement).focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      (messageEls[0] as HTMLElement)?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      (messageEls[messageEls.length - 1] as HTMLElement)?.focus();
    }
  };

  return (
    <ScrollArea
      className="relative flex flex-1 flex-col overflow-x-auto overflow-y-scroll px-4"
      scrollRef={scrollRef}
      onKeyDown={handleKeyDown}
    >
      <div className="flex flex-col" role="log" aria-live="polite">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* Currently streaming message */}
        <StreamingMessage />

        {/* Plan display */}
        {plan && plan.length > 0 && (
          <div className="mx-auto w-full max-w-thread px-2 py-4">
            <PlanDisplay entries={plan} />
          </div>
        )}

        {/* Thinking indicator */}
        <ThinkingIndicator />
      </div>

      {/* Spacer for non-empty thread */}
      {messages.length > 0 && <div className="min-h-8 grow" />}
    </ScrollArea>
  );
}
