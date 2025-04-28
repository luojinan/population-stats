import {
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  registerables,
} from "chart.js";
import { useEffect, useRef } from "preact/hooks";
import { useTheme } from "@/contexts/ThemeContext";
import { MarriageChartProps } from "@/types";

ChartJS.register(...registerables);

export function MarriageChart({
  data,
  showMarriages,
  showDivorces,
}: MarriageChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS | null>(null);
  const { theme } = useTheme();

  // 准备表格数据
  const tableData = data.years
    .map((year, index) => ({
      year: year.replace("年", ""),
      marriages: data.marriages[index],
      divorces: data.divorces[index],
      source: data.sources?.[index] || "数据来源：国家统计局",
    }))
    .sort((a, b) => Number(b.year) - Number(a.year));

  const columns = [
    { key: "year", label: "年份" },
    { key: "marriages", label: "结婚数" },
    { key: "divorces", label: "离婚数" },
    { key: "source", label: "数据来源" },
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const isDark = theme === "dark";
    const textColor = isDark
      ? "rgba(255, 255, 255, 0.87)"
      : "rgba(0, 0, 0, 0.87)";
    const gridColor = isDark
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)";

    const chartData: ChartData = {
      labels: data.years,
      datasets: [
        ...(showMarriages
          ? [
              {
                label: "结婚数",
                data: data.marriages,
                borderColor: isDark ? "rgb(255, 99, 132)" : "rgb(220, 38, 38)",
                backgroundColor: isDark
                  ? "rgba(255, 99, 132, 0.1)"
                  : "rgba(220, 38, 38, 0.1)",
                borderWidth: 2,
                tension: 0.1,
                fill: true,
              },
            ]
          : []),
        ...(showDivorces
          ? [
              {
                label: "离婚数",
                data: data.divorces,
                borderColor: isDark ? "rgb(54, 162, 235)" : "rgb(37, 99, 235)",
                backgroundColor: isDark
                  ? "rgba(54, 162, 235, 0.1)"
                  : "rgba(37, 99, 235, 0.1)",
                borderWidth: 2,
                tension: 0.1,
                fill: true,
              },
            ]
          : []),
      ],
    };

    const options: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: textColor,
            font: {
              size: 12,
            },
            boxWidth: 12,
            padding: 10,
          },
        },
        title: {
          display: true,
          text: "婚姻数（万对）",
          position: "top",
          align: "center",
          color: textColor,
          font: {
            size: 12,
          },
          padding: {
            top: 0,
            bottom: 10,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: false,
          },
          ticks: {
            color: textColor,
            font: {
              size: 10,
            },
          },
          grid: {
            color: gridColor,
          },
        },
        x: {
          title: {
            display: true,
            text: "年份",
            color: textColor,
            font: {
              size: 12,
            },
          },
          ticks: {
            color: textColor,
            font: {
              size: 10,
            },
          },
          grid: {
            color: gridColor,
          },
        },
      },
    };

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new ChartJS(ctx, {
      type: "line",
      data: chartData,
      options,
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, showMarriages, showDivorces, theme]);

  return (
    <div class="border border-base-300 rounded-lg p-1 md:p-4">
      <div class="w-full h-64 md:h-96">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
