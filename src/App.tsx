import { useEffect, useState } from "preact/hooks";
import { Chart } from "@/components/Chart";
import { ChartOptions, YearRange } from "@/components/Controls";
import { DetailDrawer } from "@/components/DetailDrawer";
import { MarriageChart } from "@/components/MarriageChart";
import { MarriageControls } from "@/components/MarriageControls";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import marriageData from "@/data/marriage_stats.json";
import populationData from "@/data/population_stats.json";
import type {
  DrawerColumn,
  MarriageDrawerData,
  PopulationData,
  PopulationDrawerData,
  ProcessedData,
  ProcessedMarriageData,
} from "@/types";
import {
  convertPopulationData,
  getDataRange,
  processMarriageData,
  processPopulationData,
} from "@/utils/data";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div class="flex justify-end mb-4">
      <label class="swap swap-rotate">
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={toggleTheme}
        />
        <svg
          class="swap-on h-6 w-6 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
        </svg>
        <svg
          class="swap-off h-6 w-6 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
        </svg>
      </label>
    </div>
  );
}

function AppContent() {
  // 人口数据相关状态
  const [startYear, setStartYear] = useState(2004);
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

  // 抽屉相关状态
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [drawerData, setDrawerData] = useState<
    PopulationDrawerData[] | MarriageDrawerData[]
  >([]);
  const [drawerColumns, setDrawerColumns] = useState<DrawerColumn[]>([]);

  // 处理显示人口数据详情
  const handleShowPopulationDetails = () => {
    if (!processedData) return;

    const tableData: PopulationDrawerData[] = processedData.years
      .map((year, index) => ({
        year,
        birth: processedData.birth[index],
        death: processedData.death[index],
      }))
      .sort((a, b) => b.year - a.year);

    setDrawerTitle("人口数据详情");
    setDrawerData(tableData);
    setDrawerColumns([
      { key: "year", label: "年份" },
      { key: "birth", label: "出生数(万人)" },
      { key: "death", label: "死亡数(万人)" },
    ]);
    setIsDetailDrawerOpen(true);
  };

  // 处理显示婚姻数据详情
  const handleShowMarriageDetails = () => {
    if (!processedMarriageData) return;

    const tableData: MarriageDrawerData[] = processedMarriageData.years
      .map((year, index) => ({
        year: year.replace("年", ""),
        marriages: processedMarriageData.marriages[index],
        divorces: processedMarriageData.divorces[index],
      }))
      .sort((a, b) => Number(b.year) - Number(a.year));

    setDrawerTitle("婚姻数据详情");
    setDrawerData(tableData);
    setDrawerColumns([
      { key: "year", label: "年份" },
      { key: "marriages", label: "结婚数(万对)" },
      { key: "divorces", label: "离婚数(万对)" },
    ]);
    setIsDetailDrawerOpen(true);
  };

  // 初始化人口数据
  useEffect(() => {
    const convertedData = convertPopulationData(populationData);
    const range = getDataRange(convertedData);
    setDataRange(range);
    // 计算最近20年的起始年份
    const recent20YearsStart = Math.max(range.minYear, range.maxYear - 19);
    setStartYear(recent20YearsStart);
    setProcessedData(
      processPopulationData(convertedData, recent20YearsStart, range.maxYear),
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
    const range = getDataRange(convertPopulationData(populationData));
    // 计算最近20年的起始年份
    const recent20YearsStart = Math.max(1985, range.maxYear - 19);
    const processedData = processMarriageData(
      marriageData,
      recent20YearsStart,
      range.maxYear,
    );
    setProcessedMarriageData(processedData);
  }, []);

  if (!processedData || !processedMarriageData) {
    return <div>加载中...</div>;
  }

  return (
    <div class="container mx-auto px-4 py-8">
      <ThemeToggle />
      <header class="text-center py-4 md:py-8">
        <h1 class="text-4xl font-bold">人口与婚姻数据</h1>
      </header>

      <main class="mt-8 space-y-8">
        {/* 人口数据部分 */}
        <section class="space-y-4">
          <div class="flex justify-between items-center">
            <h2 class="text-xl md:text-2xl font-semibold">人口变化趋势</h2>
            <button
              class="btn btn-sm btn-primary"
              onClick={handleShowPopulationDetails}
            >
              详情
            </button>
          </div>
          <div class="chart-container">
            <Chart
              data={processedData}
              startYear={startYear}
              endYear={dataRange.maxYear}
              showBirth={showBirth}
              showDeath={showDeath}
            />
            <div class="controls mt-2">
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
            </div>
          </div>
        </section>

        {/* 婚姻数据部分 */}
        <section class="space-y-4">
          <div class="flex justify-between items-center">
            <h2 class="text-xl md:text-2xl font-semibold">婚姻变化趋势</h2>
            <button
              class="btn btn-sm btn-primary"
              onClick={handleShowMarriageDetails}
            >
              详情
            </button>
          </div>
          <div class="chart-container">
            <MarriageChart
              data={processedMarriageData}
              showMarriages={showMarriages}
              showDivorces={showDivorces}
            />
            <div class="controls mt-2">
              <MarriageControls
                showMarriages={showMarriages}
                showDivorces={showDivorces}
                onToggleMarriages={() => setShowMarriages(!showMarriages)}
                onToggleDivorces={() => setShowDivorces(!showDivorces)}
              />
            </div>
          </div>
        </section>
      </main>

      <footer class="text-center py-4 text-sm text-base-content/70 mt-8">
        <p>数据来源：国家统计局</p>
        <p>© 2024 人口数据可视化项目</p>
      </footer>

      <DetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        title={drawerTitle}
        data={drawerData}
        columns={drawerColumns}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
