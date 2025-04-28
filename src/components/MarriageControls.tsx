import { MarriageControlsProps } from "@/types";

export function MarriageControls({
  showMarriages,
  showDivorces,
  onToggleMarriages,
  onToggleDivorces,
}: MarriageControlsProps) {
  return (
    <div class="flex gap-2">
      <label class="label cursor-pointer gap-1">
        <input
          type="checkbox"
          class="checkbox checkbox-primary"
          checked={showMarriages}
          onChange={onToggleMarriages}
        />
        <span class="label-text">结婚数</span>
      </label>
      <label class="label cursor-pointer gap-1">
        <input
          type="checkbox"
          class="checkbox checkbox-primary"
          checked={showDivorces}
          onChange={onToggleDivorces}
        />
        <span class="label-text">离婚数</span>
      </label>
    </div>
  );
}
