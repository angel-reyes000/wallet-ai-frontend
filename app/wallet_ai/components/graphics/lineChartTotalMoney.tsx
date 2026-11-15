"use client";

import ReactECharts from "echarts-for-react";

export default function LineChartTotalMoney({ ListValuesLineChart, DataLabelsX }: { ListValuesLineChart: Array<number>, DataLabelsX: Array<number> }) {
  const options = {
    title: {
        text: "Total balance",
        left: "left",
        top: 0,
        textStyle: {
          color: "#ffffff",
          fontWeight: "bold",
        },
    },
    xAxis: {
      type: "category",
      data: DataLabelsX,
      axisLabel: {
        color: "#ffffff",
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "rgb(134,239,172)",
      },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgb(2,13,6)",
      borderColor: "rgb(34,197,94)",
      textStyle: {
        color: "white",
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
            color: "rgb(74, 222, 128)",
            width: 3,
        },
        itemStyle: {
            color: "rgb(74, 222, 128)",
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
