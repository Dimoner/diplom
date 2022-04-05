import { Slider } from "@mui/material";
import { IAmperageMarks, IAmperageSlider } from "../Interfaces/IAmperageSlider";
import ChartComponent from "../../../Components/Chart/AmperageChart";
import React, { Dispatch, SetStateAction } from "react";
import LastMeasureComponent from "../../Components/LastMeasureComponent";
import { IAmperageState, IManagerMeasure, IMeasureItem, IOldMeasureState } from "../Interfaces/AmperagePageInterfaces";
import MeasureStatusComponent from "./MeasureStatusComponent";
import MeasureButtonActionComponent from "./MeasureButtonActionComponent";

export interface IAmperageRange {
    measureList: IMeasureItem[],
    amperageMarks: IAmperageSlider,
    measureAdditionInfo: IOldMeasureState,
    managerMeasure: IManagerMeasure,
    setStateAmperage: Dispatch<SetStateAction<IAmperageState>>
}

export default function AmperageRange({ measureList, amperageMarks, managerMeasure, measureAdditionInfo, setStateAmperage }: IAmperageRange) {
    return (
        <div style={{ display: "flex" }}>
            <LastMeasureComponent
                measure={measureList}
                leftName={"h, Нм"}
                rightName={"I, Ам"}
            />
            <div className="amperage-loader">
                <div className="amperage-loader-information">
                    <MeasureStatusComponent measureAdditionInfo={measureAdditionInfo}/>
                    <div className="amperage-loader-information-slider">
                        <div className={"control-measure-title"}>
                            Прогресс измерения:
                        </div>
                        <Slider
                            aria-label="Custom marks"
                            value={amperageMarks.value}
                            marks={amperageMarks.marks.map((value: IAmperageMarks, index: number) => {
                                if (index === 0 || index === 3 || index === 6 || index === 8 || index === 10) {
                                    value.label = value.label.replace("сек", "нм")
                                    if (value.label.includes("нм")) {
                                        return value;
                                    }

                                    value.label = `${value.label}, нм`
                                    return value;
                                }

                                value.label = "";
                                return value;
                            })}
                        />
                    </div>
                    <MeasureButtonActionComponent managerMeasure={managerMeasure} setStateAmperage={setStateAmperage}/>
                </div>
                <div>
                    <ChartComponent
                        measure={measureList}
                        xFormatter={(seriesName: number) => `Длина волны: ${seriesName}, нм`}
                        yFormatter={(val: number, opts?: any) => `${val}, Ам`}
                        yTitleFormatter={value => "Ток:"}
                        yTitle="Ток, Ам"
                        xTitle="Длина волны, нм"
                    />
                </div>
            </div>
        </div>
    )
}