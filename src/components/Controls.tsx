import { ChartOptionsProps, YearRangeProps } from "@/types";

export function YearRange({
  minYear,
  maxYear,
  currentYear,
  onYearChange,
}: YearRangeProps) {
  const handleInput = (e: Event) => {
    const value = parseInt((e.target as HTMLInputElement).value);
    // 转换值：将 range 的值转换为正确的年份
    const selectedYear = maxYear - (value - minYear);
    onYearChange(selectedYear);
  };

  return (
    <div class="form-control mb-2">
      <div class="flex justify-between mb-1">
        <span class="text-sm">{maxYear}</span>
        <span class="text-sm font-bold">起始年份: {currentYear}</span>
        <span class="text-sm">{minYear}</span>
      </div>
      <input
        type="range"
        min={minYear}
        max={maxYear}
        value={maxYear - currentYear + minYear} // 转换当前年份为 range 的值
        onInput={handleInput}
        class="range range-primary w-full"
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
      <label class="label cursor-pointer gap-1">
        <input
          type="checkbox"
          class="checkbox checkbox-primary"
          checked={showBirth}
          onChange={onToggleBirth}
        />
        <span class="label-text">出生人口</span>
      </label>
      <label class="label cursor-pointer gap-1">
        <input
          type="checkbox"
          class="checkbox checkbox-primary"
          checked={showDeath}
          onChange={onToggleDeath}
        />
        <span class="label-text">死亡人口</span>
      </label>
    </div>
  );
}
