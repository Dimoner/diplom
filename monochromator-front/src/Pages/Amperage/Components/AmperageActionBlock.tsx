import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { TSubType } from "../../../Types/Types";
import Actions from "../../../Components/Actions";
import LastMeasureComponent from "../../Components/LastMeasureComponent";
import { IAmperageState, IMeasureItem } from "../Interfaces/AmperagePageInterfaces";
import { IStartMeasureResponse } from "../../../Components/ActionList/StartMeasure/Interfaces/StartMeasureInterfaces";
import {measureInLocalStorageName} from "../Amperage";
import { IAmperageMarks } from "../Interfaces/IAmperageSlider";

export interface IAmperageActionBlock{
    alignment: TSubType,
    measureList: IMeasureItem[],
    setStateAmperage: Dispatch<SetStateAction<IAmperageState>>
}

export default function AmperageActionBlock({alignment, measureList, setStateAmperage}: IAmperageActionBlock) {
    const startMeasureAction = (startMeasure: IStartMeasureResponse) => {
        localStorage.removeItem(measureInLocalStorageName);
        //pfgecr bpvthtybz pltcm
        // @ts-ignore
        const sub = startMeasure.endPosition - startMeasure.startPosition;
        const newMarks: IAmperageMarks[] = [
            {value: 0, label: startMeasure.startPosition.toString()},
            ...[10, 20, 30, 40, 50, 60, 70, 80, 90].map((value: number, index: number) => {
                return {
                    value: value,
                    label: (startMeasure.startPosition + ((sub / 10) * (index + 1))).toFixed(0).toString()
                }
            }),
            // @ts-ignore
            {value: 100, label: startMeasure.endPosition.toString()}]
        // @ts-ignore
        setStateAmperage(prev => ({
            ...prev,
            measureList: [],
            amperageMarks: {marks: [...newMarks], value: 0, maxMave: startMeasure.endPosition},
            rangeWave: sub,
            startWave: startMeasure.startPosition,
            measureId: startMeasure.measureId.toString()
        }))
    }

    return (
        <div className="amperage-container-left">
            <div className="amperage-container-left-action">
                <ToggleButtonGroup
                    color="primary"

                    value={alignment}
                    exclusive
                    onChange={(event: any, newAlignment: TSubType) => {
                        setStateAmperage(prev => ({
                            ...prev,
                            alignment: newAlignment
                        }))
                    }}
                >
                    <ToggleButton value="range">Длина волны/ток</ToggleButton>
                    <ToggleButton value="time">Время/ток</ToggleButton>
                </ToggleButtonGroup>
                <Actions startMeasure={startMeasureAction} type={"amp"} subType={alignment} />
            </div>
            <LastMeasureComponent measure={measureList} leftName={alignment === "time" ? "t, сек" : "h, Нм"} rightName={"I, Ам"}/>
        </div>
    )
}
