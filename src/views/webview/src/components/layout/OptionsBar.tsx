import { useChatStore } from "@/store";
import { useVsCodeApi } from "@/hooks/useVsCodeApi";
import { Select } from "@/components/ui/select";

export function OptionsBar() {
  const { modes, currentModeId, models, currentModelId } = useChatStore();
  const { selectMode, selectModel } = useVsCodeApi();

  const hasModes = modes.length > 0;
  const hasModels = models.length > 0;

  if (!hasModes && !hasModels) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 border-t border-border text-xs flex-wrap flex-shrink-0">
      {hasModes && (
        <Select
          value={currentModeId || ""}
          onChange={(e) => selectMode(e.target.value)}
          label="Select Mode"
        >
          {modes.map((mode) => (
            <option key={mode.id} value={mode.id}>
              Mode: {mode.name || mode.id}
            </option>
          ))}
        </Select>
      )}

      {hasModels && (
        <Select
          value={currentModelId || ""}
          onChange={(e) => selectModel(e.target.value)}
          label="Select Model"
        >
          {models.map((model) => (
            <option key={model.modelId} value={model.modelId}>
              Model: {model.name || model.modelId}
            </option>
          ))}
        </Select>
      )}

      <div className="flex-1" />

      <span className="text-muted-foreground">
        <kbd className="px-1 py-0.5 text-[10px] bg-muted border border-border rounded">
          Enter
        </kbd>{" "}
        to send
      </span>
    </div>
  );
}
