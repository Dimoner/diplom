import { IAmperageState, IManagerMeasure, IMeasureItem, IOldMeasureState } from "../Interfaces/AmperagePageInterfaces";
import { IAmperageMarks, IAmperageSlider } from "../Interfaces/IAmperageSlider";
import LastMeasureComponent from "../../Components/LastMeasureComponent";
import { Slider } from "@mui/material";
import ChartComponent from "../../../Components/Chart/AmperageChart";
import React, { Dispatch, SetStateAction } from "react";
import MeasureStatusComponent from "./MeasureStatusComponent";
import MeasureButtonActionComponent from "./MeasureButtonActionComponent";
import { defaultValueSettingComponentStateFunc } from "../../../Components/Setting/SettingComponent";
import { useSelector } from "react-redux";
import moment from "moment";

export interface IAmperageTime {
    measureList: IMeasureItem[],
    amperageMarks: IAmperageSlider,
    measureAdditionInfo: IOldMeasureState,
    managerMeasure: IManagerMeasure,
    setStateAmperage: Dispatch<SetStateAction<IAmperageState>>
}

export default function AmperageTime({ measureList, amperageMarks, managerMeasure, measureAdditionInfo, setStateAmperage }: IAmperageTime) {
    // важно для перерендера при изменении localstorage
    const count = useSelector((state: any) => state.counter.value)

    return (
        <div style={{ display: "flex" }}>
            <LastMeasureComponent
                measure={[...measureList].map((value: IMeasureItem, index: number) => {
                    const newValue: any = {
                        x: 0,
                        y: 0
                    };

                    if (typeof value.x === "number") {
                        newValue.x = (moment.utc(value.x * measureAdditionInfo.frequency * 0.1).format('HH:mm:ss.SSS') as any as number)
                    } else {
                        newValue.x = value.x;
                    }
                    newValue.y = value.y;
                    return newValue;
                })}
                leftName={"Время"}
                rightName={`Токовый сигнал, ${defaultValueSettingComponentStateFunc().amperageName}`}
            />
            <div className="amperage-loader">
                <div className="amperage-loader-information">
                    <MeasureStatusComponent measureAdditionInfo={measureAdditionInfo} />
                    <div className="amperage-loader-information-slider">
                        <div className={"control-measure-title"}>
                            Прогресс измерения:
                        </div>
                        <Slider
                            aria-label="Custom marks"
                            value={amperageMarks.value}
                            marks={amperageMarks.marks.map((value: IAmperageMarks, index: number) => {
                                if (index === 0 || index === 3 || index === 6 || index === 10) {
                                    value.label = value.label.replace("нм", "")
                                    return value;
                                }

                                value.label = "";
                                return value;
                            })}
                        />
                    </div>
                    <MeasureButtonActionComponent managerMeasure={managerMeasure} setStateAmperage={setStateAmperage} />
                </div>
                <div>
                    <ChartComponent
                        measure={measureList}
                        xFormatter={(seriesName: number) => {
                            return `
                            Точка: ${seriesName} ||
                            Время: ${moment.utc(Number(seriesName) * measureAdditionInfo.frequency * 0.1).format('HH:mm:ss.SSS')}, сек
                            `
                        }}
                        yFormatter={(val: number, opts?: any) => `${val}, ${defaultValueSettingComponentStateFunc().amperageName}`}
                        yTitleFormatter={value => "Токовый сигнал:"}
                        type={"amperage"}
                        yTitle={`Токовый сигнал, ${defaultValueSettingComponentStateFunc().amperageName}`}
                        xTitle="Точка с начала измерения, номер"
                    />
                </div>
            </div>
        </div>
    )
}
