import {
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  registerables,
} from "chart.js";
import { useEffect, useRef, useState } from "preact/hooks";
import { MarriageChartProps } from "@/types";
import { DetailDrawer } from "./DetailDrawer";

ChartJS.register(...registerables);

export function MarriageChart({
  data,
  showMarriages,
  showDivorces,
}: MarriageChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

    const chartData: ChartData = {
      labels: data.years,
      datasets: [
        ...(showMarriages
          ? [
              {
                label: "结婚数",
                data: data.marriages,
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.1)",
                tension: 0.1,
                fill: true,
                yAxisID: "y",
              },
            ]
          : []),
        ...(showDivorces
          ? [
              {
                label: "离婚数",
                data: data.divorces,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.1)",
                tension: 0.1,
                fill: true,
                yAxisID: "y",
              },
            ]
          : []),
      ],
    };

    const options: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
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
          text: "数量（万对）",
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
        // tooltip: {
        //   callbacks: {
        //     afterBody: (tooltipItems) => {
        //       const index = tooltipItems[0].dataIndex;
        //       const source = data.sources?.[index] || "数据来源：国家统计局";
        //       return [source];
        //     },
        //   },
        // },
      },
      scales: {
        y: {
          type: "linear",
          display: true,
          position: "left",
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
  }, [data, showMarriages, showDivorces]);

  return (
    <div>
      <div class="chart-wrapper">
        <canvas ref={canvasRef}></canvas>
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
        title="婚姻数据详情"
        data={tableData}
        columns={columns}
      />
    </div>
  );
}
