import { useEffect, useState } from "preact/hooks";
import { Chart } from "@/components/Chart";
import { ChartOptions, YearRange } from "@/components/Controls";
import { MarriageChart } from "@/components/MarriageChart";
import { MarriageControls } from "@/components/MarriageControls";
import marriageData from "@/data/marriage_stats.json";
import populationData from "@/data/population_stats.json";
import type {
  PopulationData,
  ProcessedData,
  ProcessedMarriageData,
} from "@/types";
import {
  convertPopulationData,
  getDataRange,
  processMarriageData,
  processPopulationData,
} from "@/utils/data";

export function App() {
  // 人口数据相关状态
  const [startYear, setStartYear] = useState(1950);
  const [showBirth, setShowBirth] = useState(true);
  const [showDeath, setShowDeath] = useState(true);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(
    null,
  );
  const [dataRange, setDataRange] = useState({ minYear: 1950, maxYear: 2023 });

  // 婚姻数据相关状态
  const [showMarriages, setShowMarriages] = useState(true);
  const [showDivorces, setShowDivorces] = useState(true);
  const [processedMarriageData, setProcessedMarriageData] =
    useState<ProcessedMarriageData | null>(null);

  // 初始化人口数据
  useEffect(() => {
    const convertedData = convertPopulationData(populationData);
    const range = getDataRange(convertedData);
    setDataRange(range);
    setStartYear(range.minYear);
    setProcessedData(
      processPopulationData(convertedData, range.minYear, range.maxYear),
    );
  }, []);

  // 更新人口数据
  useEffect(() => {
    if (!processedData) return;
    const convertedData = convertPopulationData(populationData);
    const newData = processPopulationData(
      convertedData,
      startYear,
      dataRange.maxYear,
    );
    setProcessedData(newData);
  }, [startYear]);

  // 初始化婚姻数据
  useEffect(() => {
    const processedData = processMarriageData(marriageData, 1985, 2025);
    setProcessedMarriageData(processedData);
  }, []);

  if (!processedData || !processedMarriageData) {
    return <div>加载中...</div>;
  }

  return (
    <div class="container mx-auto px-4 py-8">
      <header class="header">
        <h1 class="text-4xl font-bold">人口与婚姻数据可视化</h1>
        <p class="text-xl mt-2">探索中国人口与婚姻变化趋势</p>
      </header>

      <main class="mt-8 space-y-8">
        {/* 人口数据部分 */}
        <section class="space-y-4">
          <div class="chart-container">
            <h2 class="text-2xl font-semibold mb-4">人口变化趋势</h2>
            <div class="chart-wrapper">
              <Chart
                data={processedData}
                startYear={startYear}
                endYear={dataRange.maxYear}
                showBirth={showBirth}
                showDeath={showDeath}
              />
            </div>
          </div>
        </section>

        <section class="controls">
          <YearRange
            minYear={dataRange.minYear}
            maxYear={dataRange.maxYear}
            currentYear={startYear}
            onYearChange={setStartYear}
          />
          <ChartOptions
            showBirth={showBirth}
            showDeath={showDeath}
            onToggleBirth={() => setShowBirth(!showBirth)}
            onToggleDeath={() => setShowDeath(!showDeath)}
          />
        </section>

        {/* 婚姻数据部分 */}
        <section class="space-y-4">
          <div class="chart-container">
            <h2 class="text-2xl font-semibold mb-4">婚姻变化趋势</h2>
            <div class="chart-wrapper">
              <MarriageChart
                data={processedMarriageData}
                showMarriages={showMarriages}
                showDivorces={showDivorces}
              />
            </div>
          </div>
        </section>

        <section class="controls">
          <MarriageControls
            showMarriages={showMarriages}
            showDivorces={showDivorces}
            onToggleMarriages={() => setShowMarriages(!showMarriages)}
            onToggleDivorces={() => setShowDivorces(!showDivorces)}
          />
        </section>
      </main>

      <footer class="footer mt-8">
        <p>数据来源：国家统计局</p>
        <p>© 2024 人口数据可视化项目</p>
      </footer>
    </div>
  );
}
