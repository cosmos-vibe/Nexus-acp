import { useChatStore } from "@/store";
import { useVsCodeApi } from "@/hooks/useVsCodeApi";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function TopBar() {
  const { connectionState, agents, selectedAgentId } = useChatStore();
  const { connect, selectAgent } = useVsCodeApi();

  const statusLabels: Record<string, string> = {
    disconnected: "Disconnected",
    connecting: "Connecting...",
    connected: "Connected",
    error: "Error",
  };

  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 border-b border-border text-xs flex-wrap flex-shrink-0">
      {/* Status indicator */}
      <div className="flex items-center gap-1">
        <div
          className={cn(
            "w-2 h-2 rounded-full transition-colors",
            connectionState === "connected" && "bg-success",
            connectionState === "connecting" && "bg-warning animate-pulse",
            connectionState === "disconnected" && "bg-destructive-foreground",
            connectionState === "error" && "bg-destructive-foreground"
          )}
          aria-label={statusLabels[connectionState]}
        />
        <span className="text-muted-foreground">
          {statusLabels[connectionState]}
        </span>
      </div>

      {/* Agent selector */}
      {agents.length > 0 && (
        <Select
          value={selectedAgentId || ""}
          onChange={(e) => selectAgent(e.target.value)}
          label="Select Agent"
        >
          {agents.map((agent) => (
            <option
              key={agent.id}
              value={agent.id}
              style={{
                color: agent.available ? undefined : "var(--vscode-disabledForeground)",
              }}
            >
              {agent.available ? agent.name : `${agent.name} (not installed)`}
            </option>
          ))}
        </Select>
      )}

      {/* Connect button */}
      {connectionState !== "connected" && (
        <Button size="sm" onClick={connect}>
          Connect
        </Button>
      )}

      <div className="flex-1" />
    </div>
  );
}
