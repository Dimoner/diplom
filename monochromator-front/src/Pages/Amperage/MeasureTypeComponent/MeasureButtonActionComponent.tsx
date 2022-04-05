import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@mui/material";
import { IAmperageState, IManagerMeasure } from "../Interfaces/AmperagePageInterfaces";

export interface IMeasureButtonActionComponent {
    managerMeasure: IManagerMeasure,
    setStateAmperage: Dispatch<SetStateAction<IAmperageState>>
}

export default function MeasureButtonActionComponent({ managerMeasure, setStateAmperage }: IMeasureButtonActionComponent) {
    const action = (actionType: "start" | "pause" | "stop") => {
        fetch(`http://localhost:5000/control-measure/${actionType}`).then()

        setStateAmperage(prev => {
            if (actionType === "pause"){
                prev.managerMeasure.isPause = true
            }

            if (actionType === "start"){
                prev.managerMeasure.isPause = false
            }

            if (actionType === "stop"){
                prev.managerMeasure.isPause = false
                prev.managerMeasure.isWork = false
            }

            return {
                ...prev,
                managerMeasure: {
                    ...prev.managerMeasure,
                }
            }
        })
    }

    return (
        <div className="control-measure">
            <div className={!managerMeasure?.isWork ? "control-measure-title-disable" : "control-measure-title"}>
                Управление измерением
            </div>
            <div className="control-measure-buttons">
                <Button
                    disabled={!(managerMeasure?.isWork && managerMeasure?.isPause)}
                    variant="contained"
                    onClick={() => action("start")}
                    color="success">
                    Продолжить
                </Button>
                <Button
                    disabled={!(managerMeasure?.isWork  && !managerMeasure?.isPause)}
                    variant="contained"
                    onClick={() => action("pause")}
                >
                    Пауза
                </Button>
                <Button
                    disabled={!managerMeasure?.isWork}
                    onClick={() => action("stop")}
                    variant="contained"
                    color="error">
                    Закончить
                </Button>
            </div>
        </div>
    )
}