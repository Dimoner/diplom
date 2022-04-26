import React, { ChangeEvent } from "react";
import {TextField} from "@mui/material";
import { getPropertyName, getPropertyNameToLower } from "../../../../Helpers/PropertyName";
import {
    IRangeMeasureFormComponentField,
    IStartMeasureState,
    ITimeMeasureFormComponentField
} from "../Interfaces/StartMeasureInterfaces";


export interface ITimeMeasureFormComponentAction {
    setValue: (name: string, innerName: string) => (value: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    actionResultView: string,
    data: ITimeMeasureFormComponentField
}

export default function TimeMeasureFormComponent(props: ITimeMeasureFormComponentAction) {
    return (
        <div>
            <div className="start-measure-text-control">
                <TextField
                    onChange={props.setValue(
                        getPropertyName<ITimeMeasureFormComponentField>(v => v.pointCount),
                        getPropertyNameToLower<IStartMeasureState>(v => v.timeState)
                    )}
                    required={true}
                    error={props.actionResultView !== "" && (props.data.pointCount <= 0 || props.data.pointCount > 65000)}
                    helperText={
                        (props.actionResultView !== "" && (props.data.pointCount <= 0 || props.data.pointCount > 65000))
                            ? "Условие: > 0 и < 65000"
                            : ""
                    }
                    style={{width: "230px", height: "70px"}}
                    defaultValue={props.data.pointCount || undefined}
                    id="standard-basic"
                    label="Кол-во точек"
                    variant="standard" />
            </div>
            <div className="start-measure-text-control">
                <TextField
                    onChange={props.setValue(
                        getPropertyName<ITimeMeasureFormComponentField>(v => v.frequency),
                        getPropertyNameToLower<IStartMeasureState>(v => v.timeState)
                    )}
                    error={props.actionResultView !== "" && (props.data.frequency <= 0 || props.data.frequency > 100)}
                    helperText={
                        props.actionResultView !== "" && (props.data.frequency <= 0 || props.data.frequency > 100)
                            ? "Больше > 0, Меньше < 101"
                            : ""
                    }
                    required={true}
                    defaultValue={props.data.frequency || undefined}
                    style={{width: "230px", height: "70px"}}
                    id="standard-basic"
                    key={getPropertyNameToLower<ITimeMeasureFormComponentField>(v => v.frequency)}
                    label="t между измер., сек"
                    variant="standard" />
            </div>
            <div className="start-measure-text-control">
                <TextField
                    onChange={props.setValue(
                        getPropertyName<ITimeMeasureFormComponentField>(v => v.count),
                        getPropertyNameToLower<IStartMeasureState>(v => v.timeState)
                    )}
                    required={true}
                    style={{width: "230px", height: "70px"}}
                    helperText={
                        (props.actionResultView !== "" && (props.data.count <= 0 || props.data.count > 1024))
                            ? "Диапозоне от 1 до 1024 раз"
                            : ""
                    }
                    defaultValue={props.data.count || undefined}
                    error={props.actionResultView !== "" && props.data.count <= 0}
                    id="standard-basic"
                    key={getPropertyNameToLower<ITimeMeasureFormComponentField>(v => v.count)}
                    label="Кол-во усреднений"
                    variant="standard" />
            </div>
        </div>
    )
}
