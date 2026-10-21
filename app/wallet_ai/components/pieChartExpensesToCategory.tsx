"use client"

import ReactECharts from "echarts-for-react";
import { TotalToCategory } from "@/app/schemas/schemas";

export default function PieChartExpensesToCategory({ TotalCategoryValue }: { TotalCategoryValue: TotalToCategory[] | undefined }) {
  const option = {
    title: {
        text: "Total to category",
        left: "left",
        top: 0,
    },
    series: [
      {
        type: "pie",
        center: ["35%", "50%"],
        radius: "80%",
        labelLine: {
            show: false,
        },
        label: {
            show: false,
        },
        data: TotalCategoryValue,
      },
    ],
    legend: {
        orient: "vertical",
        right: 30,
        top: "center",
    },
    grid: {
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
    },
  };

  return <ReactECharts option={option} style={{width: '100%', height: '100%'}} />;
}