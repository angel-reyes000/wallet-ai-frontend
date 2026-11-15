
import ReactECharts from "echarts-for-react";
import { ListCardsBarChart } from "@/app/schemas/schemas";
import { useSettings } from "../settingsProvider";

export default function BarChartTotalTypes ({ listCardsBarChart }: { listCardsBarChart: ListCardsBarChart[]}) {
    const { theme } = useSettings();
    const ink = theme === "light" ? "#052e16" : "white";
    const option = {
        // title: {
        //     text: "Ventas mensuales"
        // },
        grid: {
            top: 30,
            bottom: 10,
            left: 10,
            right: 10,
            containLabel: true
        },
        tooltip: {},
        xAxis: {
            type: "category",
            axisLabel: {
                color: ink
            },
            data: listCardsBarChart?.map(obj => obj.card),
        },
        yAxis: {
            type: "value",
            axisLabel: {
                color: ink
            },
            splitLine: { lineStyle: { color: theme === "light" ? "rgba(5,46,22,0.1)" : "rgba(255,255,255,0.08)" } },
        },
        series: [
            {
                name: "Total",
                type: "bar",
                itemStyle: { borderRadius: [6, 6, 0, 0] },
                data: listCardsBarChart?.map(obj => ({
                    value: obj.total,
                    itemStyle: { color: obj.background_color || "#888888" },
                })),
                label: {
                    show: true,
                    position: "top",
                    color: ink,
                    fontSize: 12,
                    formatter: "${c}",                    
                },
            }
        ]
    };

  return <ReactECharts option={option} />;

};

