import React from "react";
import {TextField} from "@mui/material";
import {getPropertyName} from "../../../../Helpers/PropertyName";
import {
    IRangeMeasureFormComponentField,
} from "../Interfaces/StartMeasureInterfaces";

export interface IRangeMeasureFormComponentAction {
    setValue: (value: number, fieldName: keyof IRangeMeasureFormComponentField) => void,
}

export default function RangeMeasureFormComponent(props: IRangeMeasureFormComponentAction & IRangeMeasureFormComponentField) {
    return (
        <div>
            <div className="start-measure-text-control">
                <TextField
                    onChange={(value) => {
                        props.setValue(Number(value.target.value || 0), getPropertyName<IRangeMeasureFormComponentField>(v => v.endPosition))
                    }}
                    style={{width: "330px"}}
                    id="standard-basic"
                    label="Конечное положение (нм):"
                    variant="standard" />
            </div>
            <div className="start-measure-text-control">
                <TextField
                    onChange={(value) => {
                        props.setValue(Number(value.target.value || 0), getPropertyName<IRangeMeasureFormComponentField>(v => v.step))
                    }}
                    style={{width: "330px"}}
                    id="standard-basic"
                    label="Шаг (нм):"
                    variant="standard" />
            </div>
            <div className="start-measure-text-control">
                <TextField
                    onChange={(value) => {
                        props.setValue(Number(value.target.value || 0), getPropertyName<IRangeMeasureFormComponentField>(v => v.count))
                    }}
                    style={{width: "330px"}}
                    id="standard-basic"
                    label="Кол-во измерений в точке"
                    variant="standard" />
            </div>
        </div>
    )
}
