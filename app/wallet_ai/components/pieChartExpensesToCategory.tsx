"use client"

import ReactECharts from "echarts-for-react";
import { TotalToCategory } from "@/app/schemas/schemas";

export default function PieChartExpensesToCategory({ TotalCategoryValue }: { TotalCategoryValue: TotalToCategory[] | undefined }) {
  const option = {
    title: {
        text: "Total to category",
        left: "left",
        top: 0,
        textStyle: {
          color: "#ffffff",
          fontWeight: "bold",
          fontSize: 18,
        },
    },
    color: [
      "#FF1744", // Rojo brillante
      "#FF9100", // Naranja intenso
      "#FFEA00", // Amarillo eléctrico
      "#76FF03", // Verde lima
      "#00E676", // Verde esmeralda
      "#1DE9B6", // Turquesa
      "#00E5FF", // Cian eléctrico
      "#2979FF", // Azul brillante
      "#651FFF", // Violeta intenso
      "#D500F9", // Magenta
      "#FF00A8", // Rosa neón
      "#FF6D00", // Naranja fuego
      "#AEEA00", // Lima amarillento
      "#7C4DFF"  // Púrpura brillante
    ],
    series: [
      {
        type: "pie",
        center: ["35%", "50%"],
        radius: "80%",
        labelLine: {
            show: false,
        },
        label: {
            show: true,
            position: 'inside',
            formatter: '${c}\n{d}%',
            color: 'rgb(255, 255, 255)',
            fontSize: 13,
            fontWeight: 900,
        },
        emphasis: {
          label: {
            show: true,
            formatter: '${c}\n({d}%)',
            color: 'rgb(255, 255, 255)'
          }
        },
        data: TotalCategoryValue,
      },
    ],
    legend: {
        orient: "vertical",
        right: 30,
        top: "center",
        textStyle: {
          color: "#ffffff",
          fontWeight: "bold",
        },
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