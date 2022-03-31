import React from "react";
import {TextField} from "@mui/material";
import {getPropertyName} from "../../../Helpers/PropertyName";

export interface IRangeMeasureFormComponentField {
    endPosition: number,
    step: number,
    count: number,
}

export interface IRangeMeasureFormComponentAction {
    setValue: (value: number, fieldName: string) => void,
}

export default function RangeMeasureFormComponent(props: IRangeMeasureFormComponentAction & IRangeMeasureFormComponentField) {
    return (
        <div>
            <div className="start-measure-text-control">
                <TextField
                    onChange={(value) => {
                        props.setValue(Number(value.target.value || 0), getPropertyName<IRangeMeasureFormComponentField>(v => v.endPosition))
                    }}
                    style={{width: "230px"}}
                    id="standard-basic"
                    label="Конечное положение (нм):"
                    variant="standard" />
            </div>
            <div className="start-measure-text-control">
                <TextField
                    onChange={(value) => {
                        props.setValue(Number(value.target.value || 0), getPropertyName<IRangeMeasureFormComponentField>(v => v.step))
                    }}
                    style={{width: "230px"}}
                    id="standard-basic"
                    label="Шаг (нм):"
                    variant="standard" />
            </div>
            <div className="start-measure-text-control">
                <TextField
                    onChange={(value) => {
                        props.setValue(Number(value.target.value || 0), getPropertyName<IRangeMeasureFormComponentField>(v => v.count))
                    }}
                    style={{width: "230px"}}
                    id="standard-basic"
                    label="Кол-во измерений в точке"
                    variant="standard" />
            </div>
        </div>
    )
}
