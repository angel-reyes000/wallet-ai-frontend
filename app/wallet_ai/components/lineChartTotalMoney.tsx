"use client";

import ReactECharts from "echarts-for-react";

export default function LineChartTotalMoney({ ListTotalBalance }: { ListTotalBalance: Array<number> }) {
  const options = {
    title: {
        text: "Total balance",
        left: "left",
        top: 0,
    },
    xAxis: {
      type: "category",
      data: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: ListTotalBalance,
        type: "line",
        smooth: true,
        areaStyle: {
            opacity: 0.3,
            color: "rgb(0,100,0,0.5)",
        },
        lineStyle: {
            color: "rgb(0,100,0)",
            width: 3,
        },
        itemStyle: {
            color: "rgb(0,80,0)",
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
