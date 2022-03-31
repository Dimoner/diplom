import React from "react";
import {TextField} from "@mui/material";
import {getPropertyName} from "../../../../Helpers/PropertyName";
import {ITimeMeasureFormComponentField} from "../Interfaces/StartMeasureInterfaces";


export interface ITimeMeasureFormComponentAction {
    setValue: (value: number, fieldName: string) => void,
}
export default function TimeMeasureFormComponent(props: ITimeMeasureFormComponentField & ITimeMeasureFormComponentAction) {
    return (
        <div>
            <div className="start-measure-text-control">
                <TextField
                    onChange={(value) => {
                        props.setValue(Number(value.target.value || 0), getPropertyName<ITimeMeasureFormComponentField>(v => v.delay))
                    }}
                    style={{width: "230px"}}
                    id="standard-basic"
                    label="Время измерения, сек"
                    variant="standard" />
            </div>
            <div className="start-measure-text-control">
                <TextField
                    onChange={(value) => {
                        props.setValue(Number(value.target.value || 0), getPropertyName<ITimeMeasureFormComponentField>(v => v.frequency))
                    }}
                    style={{width: "230px"}}
                    id="standard-basic"
                    label="Частота измерения"
                    variant="standard" />
            </div>
            <div className="start-measure-text-control">
                <TextField
                    onChange={(value) => {
                        props.setValue(Number(value.target.value || 0), getPropertyName<ITimeMeasureFormComponentField>(v => v.num))
                    }}
                    style={{width: "230px"}}
                    id="standard-basic"
                    label="Кол-во измерений за 1 период"
                    variant="standard" />
            </div>
        </div>
    )
}
