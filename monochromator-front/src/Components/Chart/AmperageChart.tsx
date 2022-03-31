import * as React from 'react';
import Chart from "react-apexcharts";
import {ApexOptions} from "apexcharts";
import {useEffect, useState} from "react";

export interface IChartComponentProps {
    measure: { xValue: number, yValue: number }[],
    xFormatter: (seriesName: number) =>  string,
    yFormatter: (val: number, opts?: any) =>  string,
    yTitleFormatter: (value: string) => string
}

export default function ChartComponent(props: IChartComponentProps) {
    const [chartState, setChartState] = useState<{
        option: {
            chart: ApexChart,
            xaxis: ApexXAxis,
            yaxis: ApexYAxis,
            markers: ApexMarkers,
            tooltip: ApexTooltip
        },
        series:  ApexOptions['series']
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
                size: 5,
            },
            xaxis: {
                type: "numeric"
            },
            yaxis: {
                min: 0,
                max: 0
            },
            tooltip: {
                enabled: true,
                style: {
                    fontSize: '12px',
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
                        return  props.yFormatter(val, opts)
                    },
                    title: {
                        formatter: (seriesName) =>  props.yTitleFormatter(seriesName),
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
            }
        },
        series:[
            {
                name: "Ток: ",
                data: []
            }
        ],
    })

    useEffect(() => {
        const measure = [...props.measure].reverse();
        chartState.series = [
            {
                name: "series-1",
                data: [...measure.map(value => {
                    return {
                        x : value.xValue,
                        y: value.yValue
                    }
                })]
            }
        ]

        chartState.option.yaxis = {
            min: 0,
            max: Math.max(...measure.map(value => value.yValue)) + (Math.max(...measure.map(value => value.yValue)) * 20) / 100
        }

        ApexCharts.exec('basic-bar', 'updateOptions', chartState.option);
        ApexCharts.exec("realtime", "updateSeries", chartState.series)
    }, [props.measure])


    return (
        <div style={{width: "80%"}}>
            <Chart
                options={chartState.option}
                series={chartState.series}
                type="line"
            />
        </div>
    )
}
