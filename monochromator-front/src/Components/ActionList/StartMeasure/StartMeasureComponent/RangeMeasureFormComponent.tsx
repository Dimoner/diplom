import React, { ChangeEvent } from "react";
import { TextField } from "@mui/material";
import { getPropertyName, getPropertyNameToLower } from "../../../../Helpers/PropertyName";
import {
    IRangeMeasureFormComponentField,
    IStartMeasureState,
    ITimeMeasureFormComponentField
} from "../Interfaces/StartMeasureInterfaces";

export interface IRangeMeasureFormComponentAction {
    setValue: (name: string, innerName: string) => (value: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    actionResultView: string,
    data: IRangeMeasureFormComponentField
}

export default function RangeMeasureFormComponent(props: IRangeMeasureFormComponentAction) {
    return (
        <div>
            <div className="start-measure-text-control">
                <TextField
                    onChange={props.setValue(
                        getPropertyName<IRangeMeasureFormComponentField>(v => v.endPosition),
                        getPropertyNameToLower<IStartMeasureState>(v => v.rangeState)
                    )}
                    style={{width: "330px"}}
                    id="standard-basic"
                    type={"number"}
                    required={true}
                    error={props.actionResultView !== "" && props.data.endPosition <= 0}
                    key={getPropertyNameToLower<IRangeMeasureFormComponentField>(v => v.endPosition)}
                    label="Конечное положение (нм):"
                    variant="standard" />
            </div>
            <div className="start-measure-text-control">
                <TextField
                    onChange={props.setValue(
                        getPropertyName<IRangeMeasureFormComponentField>(v => v.step),
                        getPropertyNameToLower<IStartMeasureState>(v => v.rangeState)
                    )}
                    required={true}
                    error={props.actionResultView !== "" && props.data.step <= 0}
                    style={{width: "330px"}}
                    id="standard-basic"
                    label="Шаг (нм):"
                    type={"number"}
                    key={getPropertyNameToLower<IRangeMeasureFormComponentField>(v => v.step)}
                    variant="standard" />
            </div>
            <div className="start-measure-text-control">
                <TextField
                    onChange={props.setValue(
                        getPropertyName<IRangeMeasureFormComponentField>(v => v.count),
                        getPropertyNameToLower<IStartMeasureState>(v => v.rangeState)
                    )}
                    required={true}
                    error={props.actionResultView !== "" && props.data.count <= 0}
                    style={{width: "330px"}}
                    id="standard-basic"
                    type={"number"}
                    key={getPropertyNameToLower<IRangeMeasureFormComponentField>(v => v.count)}
                    label="Кол-во измерений в точке"
                    variant="standard" />
            </div>
        </div>
    )
}
