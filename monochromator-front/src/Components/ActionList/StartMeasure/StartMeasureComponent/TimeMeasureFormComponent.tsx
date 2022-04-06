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
                        getPropertyName<ITimeMeasureFormComponentField>(v => v.delay),
                        getPropertyNameToLower<IStartMeasureState>(v => v.timeState)
                    )}
                    required={true}
                    error={props.actionResultView !== "" && props.data.delay <= 0.9}
                    helperText={
                        (props.actionResultView !== "" && props.data.delay <= 0.9)
                            ? "Больше > 0.9"
                            : ""
                    }
                    style={{width: "230px", height: "70px"}}
                    defaultValue={props.data.delay || undefined}
                    id="standard-basic"
                    label="Время измерения, сек"
                    variant="standard" />
            </div>
            <div className="start-measure-text-control">
                <TextField
                    onChange={props.setValue(
                        getPropertyName<ITimeMeasureFormComponentField>(v => v.frequency),
                        getPropertyNameToLower<IStartMeasureState>(v => v.timeState)
                    )}
                    error={props.actionResultView !== "" && props.data.frequency <= 0.9}
                    helperText={
                        (props.actionResultView !== "" && props.data.frequency <= 0.9)
                            ? "Больше > 0.9"
                            : ""
                    }
                    required={true}
                    defaultValue={props.data.frequency || undefined}
                    style={{width: "230px", height: "70px"}}
                    id="standard-basic"
                    key={getPropertyNameToLower<ITimeMeasureFormComponentField>(v => v.frequency)}
                    label="Частота измерения"
                    variant="standard" />
            </div>
            <div className="start-measure-text-control">
                <TextField
                    onChange={props.setValue(
                        getPropertyName<ITimeMeasureFormComponentField>(v => v.num),
                        getPropertyNameToLower<IStartMeasureState>(v => v.timeState)
                    )}
                    required={true}
                    style={{width: "230px", height: "70px"}}
                    helperText={
                        (props.actionResultView !== "" && (props.data.num <= 0 || props.data.num > 1024))
                            ? "Диапозоне от 1 до 1024 раз"
                            : ""
                    }
                    defaultValue={props.data.num || undefined}
                    error={props.actionResultView !== "" && props.data.num <= 0}
                    id="standard-basic"
                    key={getPropertyNameToLower<ITimeMeasureFormComponentField>(v => v.num)}
                    label="Кол-во измерений за 1 период"
                    variant="standard" />
            </div>
        </div>
    )
}
