
import ReactECharts from "echarts-for-react";
import { ListCardsBarChart } from "@/app/schemas/schemas";

export default function BarChartTotalTypes ({ listCardsBarChart }: { listCardsBarChart: ListCardsBarChart[]}) {
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
                color: "white"
            },
            data: listCardsBarChart?.map(obj => obj.card),
        },
        yAxis: {
            type: "value",
            axisLabel: {
                color: "white"
            },
        },
        series: [
            {
                name: "Ventas",
                type: "bar",
                data: listCardsBarChart?.map(obj => ({
                    value: obj.total,
                    itemStyle: { color: obj.background_color || "#888888" },
                })),
            }
        ]
    };

  return <ReactECharts option={option} />;

};

