import {
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  registerables,
} from "chart.js";
import { useEffect, useRef } from "preact/hooks";
import { ChartProps } from "@/types";

// 注册所有 Chart.js 组件
ChartJS.register(...registerables);

export function Chart({
  data,
  startYear,
  endYear,
  showBirth,
  showDeath,
}: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const chartData: ChartData = {
      labels: data.years,
      datasets: [
        ...(showBirth
          ? [
              {
                label: "出生人口",
                data: data.birth,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.1)",
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
                borderColor: "rgb(54, 162, 235)",
                backgroundColor: "rgba(54, 162, 235, 0.1)",
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
            font: {
              size: 12,
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "人口数（万人）",
            font: {
              size: 12,
            },
          },
        },
        x: {
          title: {
            display: true,
            text: "年份",
            font: {
              size: 12,
            },
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
  }, [data, showBirth, showDeath]);

  return <canvas ref={canvasRef} />;
}
