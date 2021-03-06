import * as React from 'react';
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { IMeasureItem } from "../../Pages/Amperage/Interfaces/AmperagePageInterfaces";
import { useSettingFuncAction } from "../Setting/SettingComponent";
import { useSelector } from "react-redux";

export interface IChartComponentProps {
    measure: IMeasureItem[],
    xFormatter: (seriesName: number) => string,
    xTitle: string,
    yTitle: string,
    yFormatter: (val: number, opts?: any) => string,
    yTitleFormatter: (value: string) => string,
    type: "amperage" | "tick"
}

export default function ChartComponent(props: IChartComponentProps) {
    const count = useSelector((state: any) => state.counter.value)
    const [chartState, setChartState] = useState<{
        option: {
            chart: ApexChart,
            xaxis: ApexXAxis,
            yaxis: ApexYAxis,
            markers: ApexMarkers,
            tooltip: ApexTooltip,
            stroke: ApexStroke
        },
        series: ApexOptions['series']
    }>({
        option: {
            chart: {
                id: "basic-bar",
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 1000,
                    animateGradually: {
                        enabled: true,
                        delay: 550
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 450
                    }
                },
            },
            markers: {
            },
            xaxis: {
                title: {
                    text: props.xTitle
                },
                type: "numeric"
            },
            yaxis: {
                title: {
                    text: props.yTitle
                },
                min: 0,
                max: 0
            },
            tooltip: {
                enabled: true,
                style: {
                    fontSize: '14px',
                    fontFamily: undefined
                },
                onDatasetHover: {
                    highlightDataSeries: false,
                },
                x: {
                    show: true,
                    formatter: props.xFormatter,
                },
                y: {
                    formatter(val: number, opts?: any): string {
                        return props.yFormatter(val, opts)
                    },
                    title: {
                        formatter: (seriesName) => props.yTitleFormatter(seriesName),
                    }
                },
                marker: {
                    show: true,
                },
                items: {
                    display: "flex",
                },
                fixed: {
                    enabled: false,
                    position: 'topRight',
                    offsetX: 0,
                    offsetY: 0,
                },
            },
            stroke: {
                width: [2, 2]
            },
        },

        series: [
            {
                name: "??????: ",
                data: []
            }
        ],
    })

    useEffect(() => {
        const measure = [...props.measure].map(measureValue => {
            return {
                ...measureValue,
                y: Number(useSettingFuncAction(props.type, measureValue.y).toFixed(2))
            }
        }).reverse();
        chartState.series = [
            {
                name: "series-1",
                data: [...measure.map(value => {
                    return {
                        x: value.x,
                        y: value.y
                    }
                })]
            }
        ]

        chartState.option.yaxis = {
            title: {
                text: props.yTitle
            },
            min: 0,
            max: Math.max(...measure.map(value => value.y)) + (Math.max(...measure.map(value => value.y)) * 20) / 100
        }

        ApexCharts.exec('basic-bar', 'updateOptions', chartState.option);
        ApexCharts.exec("realtime", "updateSeries", chartState.series)
        setChartState(prev => {
            return {
                ...prev,
            }
        })
    }, [props.measure, count])


    return (
        <div style={{ width: "88%" }}>
            <Chart
                options={chartState.option}
                series={chartState.series}
                type="line"
            />
        </div>
    )
}
