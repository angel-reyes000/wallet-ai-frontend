"use client";

import ReactECharts from "echarts-for-react";
import { useSettings } from "../settingsProvider";

export default function LineChartTotalMoney({ ListValuesLineChart, DataLabelsX }: { ListValuesLineChart: Array<number>, DataLabelsX: Array<number> }) {
  const { theme } = useSettings();
  const light = theme === "light";
  const ink = light ? "#052e16" : "#ffffff";
  const accent = light ? "rgb(21,128,61)" : "rgb(74, 222, 128)";
  const options = {
    title: {
        text: "Total balance",
        left: "left",
        top: 0,
        textStyle: {
          color: ink,
          fontWeight: "bold",
        },
    },
    xAxis: {
      type: "category",
      data: DataLabelsX,
      axisLabel: {
        color: ink,
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: light ? "rgb(22,101,52)" : "rgb(134,239,172)",
      },
      splitLine: { lineStyle: { color: light ? "rgba(5,46,22,0.1)" : "rgba(255,255,255,0.08)" } },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: light ? "#ffffff" : "rgb(2,13,6)",
      borderColor: "rgb(34,197,94)",
      textStyle: {
        color: ink,
        fontWeight: "bold",
      },
    },
    series: [
      {
        data: ListValuesLineChart,
        type: "line",
        smooth: true,
        areaStyle: {
            opacity: 0.3,
            color: "rgba(34,197,94,0.6)",
        },
        lineStyle: {
            color: accent,
            width: 3,
        },
        itemStyle: {
            color: accent,
        },
      },
    ],
    grid: {
        left: 0,
        right: 0,
        bottom: 0,
        top: 50,
    },
  };

  return <ReactECharts option={options} style={{'width': '100%', height: '100%'}} />;
}
