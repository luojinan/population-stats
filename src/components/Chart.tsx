import {
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  registerables,
} from "chart.js";
import { useEffect, useRef, useState } from "preact/hooks";
import { ChartProps } from "@/types";
import { DetailDrawer } from "./DetailDrawer";

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
            boxWidth: 12,
            padding: 10,
          },
        },
        title: {
          display: true,
          text: "人口数（万人）",
          position: "top",
          align: "center",
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
            font: {
              size: 10,
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
          ticks: {
            font: {
              size: 10,
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

  return (
    <div>
      <div class="chart-container">
        <canvas ref={canvasRef} />
      </div>
      <button
        class="btn btn-sm btn-primary"
        onClick={() => setIsDrawerOpen(true)}
      >
        详情
      </button>
      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="人口数据详情"
        data={tableData}
        columns={columns}
      />
    </div>
  );
}
