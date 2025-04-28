export interface PopulationData {
  year: number;
  total: number;
  birth: number;
  death: number;
  growth: number;
}

export interface ProcessedData {
  years: number[];
  birth: number[];
  death: number[];
}

export interface ChartProps {
  data: ProcessedData;
  startYear: number;
  endYear: number;
  showBirth: boolean;
  showDeath: boolean;
}

export interface YearRangeProps {
  minYear: number;
  maxYear: number;
  currentYear: number;
  onYearChange: (year: number) => void;
}

export interface ChartOptionsProps {
  showBirth: boolean;
  showDeath: boolean;
  onToggleBirth: () => void;
  onToggleDeath: () => void;
}

export interface MarriageData {
  year: number;
  quarter: string;
  marriages: number;
  divorces: number;
  divorceRate: number;
}

export interface ProcessedMarriageData {
  years: string[];
  marriages: number[];
  divorces: number[];
  sources?: string[];
}

export interface MarriageChartProps {
  data: ProcessedMarriageData;
  showMarriages: boolean;
  showDivorces: boolean;
}

export interface MarriageControlsProps {
  showMarriages: boolean;
  showDivorces: boolean;
  onToggleMarriages: () => void;
  onToggleDivorces: () => void;
}

export interface MarriageQuarterData {
  marriages: number;
  divorces: number;
  source: string;
}

export interface MarriageYearData {
  marriages: number;
  divorces: number | null;
  source: string;
  quarters?: {
    Q1?: MarriageQuarterData;
    Q2?: MarriageQuarterData;
    Q3?: MarriageQuarterData;
    Q4?: MarriageQuarterData;
  };
}

export interface DrawerColumn {
  key: string;
  label: string;
}

export interface PopulationDrawerData {
  year: number;
  birth: number;
  death: number;
}

export interface MarriageDrawerData {
  year: string;
  marriages: number;
  divorces: number;
} 