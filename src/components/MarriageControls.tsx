import { MarriageControlsProps } from "@/types";

export function MarriageControls({
  showMarriages,
  showDivorces,
  onToggleMarriages,
  onToggleDivorces,
}: MarriageControlsProps) {
  return (
    <div class="flex gap-2">
      <button
        class={`btn ${showMarriages ? "btn-primary" : "btn-outline"}`}
        onClick={onToggleMarriages}
      >
        结婚数
      </button>
      <button
        class={`btn ${showDivorces ? "btn-primary" : "btn-outline"}`}
        onClick={onToggleDivorces}
      >
        离婚数
      </button>
    </div>
  );
}
