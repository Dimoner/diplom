import { IAmperageRange } from "./AmperageRange";
import { IMeasureItem } from "../Interfaces/AmperagePageInterfaces";
import { TSubType } from "../../../Types/Types";
import { IAmperageMarks, IAmperageSlider } from "../Interfaces/IAmperageSlider";
import LastMeasureComponent from "../../Components/LastMeasureComponent";
import { Slider } from "@mui/material";
import ChartComponent from "../../../Components/Chart/AmperageChart";
import React from "react";

export interface IAmperageTime {
    measureList: IMeasureItem[],
    amperageMarks: IAmperageSlider,
}

export default function AmperageTime({measureList, amperageMarks}: IAmperageTime) {
    return (
        <div style={{display: "flex"}}>
            <LastMeasureComponent
                measure={measureList}
                leftName={"t, сек"}
                rightName={"I, Ам"}
            />
            <div className="amperage-loader">
                <div style={{width: "350px"}}>
                    <Slider
                        aria-label="Custom marks"
                        value={amperageMarks.value}
                        marks={amperageMarks.marks.map((value: IAmperageMarks, index: number) => {
                            if (index === 0 || index === 3 || index === 6 || index === 8 || index === 10){
                                value.label = value.label.replace("нм", "сек")
                                if(value.label.includes("сек")){
                                    return value;
                                }

                                value.label = `${value.label}, сек`
                                return value;
                            }

                            value.label = "";
                            return value;
                        })}
                    />
                </div>
                <div >
                    <ChartComponent
                        measure={measureList}
                        xFormatter={(seriesName: number) => `Время: ${seriesName}, сек`}
                        yFormatter={(val: number, opts?: any) => `${val}, Ам`}
                        yTitleFormatter={value => "Ток:"}
                        yTitle="Ток, Ам"
                        xTitle="Время с начала измерения, с"
                    />
                </div>
            </div>
        </div>
    )
}
