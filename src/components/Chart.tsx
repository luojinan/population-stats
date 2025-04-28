import {
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  registerables,
} from "chart.js";
import { useEffect, useRef } from "preact/hooks";
import { useTheme } from "@/contexts/ThemeContext";
import { ChartProps } from "@/types";

// 注册所有 Chart.js 组件
ChartJS.register(...registerables);

export function Chart({ data, showBirth, showDeath }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS | null>(null);
  const { theme } = useTheme();

  // 准备表格数据
  const tableData = data.years
    .map((year, index) => ({
      year,
      birth: data.birth[index],
      death: data.death[index],
    }))
    .sort((a, b) => b.year - a.year);

  const columns = [
    { key: "year", label: "年份" },
    { key: "birth", label: "出生人口" },
    { key: "death", label: "死亡人口" },
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
        ...(showBirth
          ? [
              {
                label: "出生人口",
                data: data.birth,
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
        ...(showDeath
          ? [
              {
                label: "死亡人口",
                data: data.death,
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
          text: "人口数（万人）",
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
  }, [data, showBirth, showDeath, theme]);

  return (
    <div class="border border-base-300 rounded-lg p-1 md:p-4">
      <div class="w-full h-64 md:h-96">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
