import { ChartOptionsProps, YearRangeProps } from "@/types";

export function YearRange({
  minYear,
  maxYear,
  currentYear,
  onYearChange,
}: YearRangeProps) {
  return (
    <div class="form-control">
      <label class="label">
        <span class="label-text">年份范围</span>
        <span class="label-text-alt">
          {currentYear}-{maxYear}
        </span>
      </label>
      <input
        type="range"
        min={minYear}
        max={maxYear}
        value={currentYear}
        onInput={(e) =>
          onYearChange(parseInt((e.target as HTMLInputElement).value))
        }
        class="range range-primary"
      />
    </div>
  );
}

export function ChartOptions({
  showBirth,
  showDeath,
  onToggleBirth,
  onToggleDeath,
}: ChartOptionsProps) {
  return (
    <div class="flex gap-2">
      <button
        class={`btn ${showBirth ? "btn-primary" : "btn-outline"}`}
        onClick={onToggleBirth}
      >
        出生人口
      </button>
      <button
        class={`btn ${showDeath ? "btn-primary" : "btn-outline"}`}
        onClick={onToggleDeath}
      >
        死亡人口
      </button>
    </div>
  );
}
