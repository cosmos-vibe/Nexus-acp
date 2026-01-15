import { useVsCodeApi } from "@/hooks/useVsCodeApi";
import { Button } from "@/components/ui/button";

export function WelcomeView() {
  const { connect } = useVsCodeApi();

  return (
    <div className="mx-auto my-auto flex w-full max-w-thread flex-grow flex-col px-4">
      <div className="flex w-full flex-grow flex-col items-center justify-center">
        <div className="flex size-full flex-col justify-center px-8">
          <div className="animate-slide-in text-2xl font-semibold text-foreground">
            Hello there!
          </div>
          <div
            className="animate-slide-in text-2xl text-muted-foreground/65"
            style={{ animationDelay: "0.1s" }}
          >
            How can I help you today?
          </div>
        </div>
      </div>

      {/* Suggestions grid */}
      <div className="grid w-full gap-2 pb-4 grid-cols-2">
        {[
          {
            title: "Connect to agent",
            label: "to start chatting",
            action: "connect",
          },
          {
            title: "Documentation",
            label: "learn more",
            action: "docs",
          },
        ].map((item, index) => (
          <div
            key={item.title}
            className="animate-slide-in"
            style={{ animationDelay: `${0.05 * index}s` }}
          >
            <Button
              variant="ghost"
              onClick={item.action === "connect" ? connect : undefined}
              className="h-auto w-full flex-1 flex-wrap items-start justify-start gap-1 rounded-3xl border px-5 py-4 text-left text-sm flex-col hover:bg-accent/60"
              {...(item.action === "docs" && {
                onClick: () =>
                  window.open(
                    "https://github.com/anthropics/anthropic-quickstarts",
                    "_blank"
                  ),
              })}
            >
              <span className="font-medium">{item.title}</span>
              <span className="text-muted-foreground">{item.label}</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
