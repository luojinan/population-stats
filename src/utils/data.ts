import { MarriageYearData, PopulationData, ProcessedData, ProcessedMarriageData } from '@/types';

export function convertPopulationData(data: any): PopulationData[] {
  return data.years.map((item: any) => ({
    year: item.year,
    total: 0, // 暂时设为0，后续可以计算
    birth: item.births,
    death: item.deaths,
    growth: 0 // 暂时设为0，后续可以计算
  }));
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function processPopulationData(
  data: PopulationData[],
  startYear: number,
  endYear: number
): ProcessedData {
  const filteredData = data.filter(
    (item: PopulationData) => item.year >= startYear && item.year <= endYear
  );

  return {
    years: filteredData.map((item: PopulationData) => item.year),
    birth: filteredData.map((item: PopulationData) => item.birth),
    death: filteredData.map((item: PopulationData) => item.death),
  };
}

export function getDataRange(data: PopulationData[]): {
  minYear: number;
  maxYear: number;
} {
  const years = data.map((item) => item.year);
  return {
    minYear: Math.min(...years),
    maxYear: Math.max(...years),
  };
}

export function processMarriageData(
  data: Record<string, MarriageYearData>,
  startYear: number,
  endYear: number
): ProcessedMarriageData {
  const years: string[] = [];
  const marriages: number[] = [];
  const divorces: number[] = [];
  const sources: string[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const yearData = data[year.toString()];
    if (!yearData) continue;

    years.push(year.toString());
    marriages.push(yearData.marriages);
    divorces.push(yearData.divorces || 0);
    sources.push(yearData.source);
  }

  return {
    years,
    marriages,
    divorces,
    sources,
  };
} 