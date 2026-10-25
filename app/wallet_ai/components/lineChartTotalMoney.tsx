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
        color: "rgb(0,200,0)",
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "black",
      borderColor: "rgb(0,200,0)",
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
            color: "rgba(0,255,0,0.5)",
        },
        lineStyle: {
            color: "rgb(0, 255, 0)",
            width: 3,
        },
        itemStyle: {
            color: "rgb(0, 255, 0)",
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
