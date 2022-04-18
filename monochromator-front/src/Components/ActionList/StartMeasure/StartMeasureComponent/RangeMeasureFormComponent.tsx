import React, { ChangeEvent } from "react";
import {
    InputLabel,
    MenuItem, NativeSelect,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    TextField,
    Theme,
    useTheme
} from "@mui/material";
import { getPropertyName, getPropertyNameToLower } from "../../../../Helpers/PropertyName";
import {
    IRangeMeasureFormComponentField,
    IStartMeasureState,
    ITimeMeasureFormComponentField
} from "../Interfaces/StartMeasureInterfaces";

export interface IRangeMeasureFormComponentAction {
    setValue: (name: string, innerName: string) => (value: ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => void,
    actionResultView: string,
    data: IRangeMeasureFormComponentField
}

export default function RangeMeasureFormComponent(props: IRangeMeasureFormComponentAction) {
    return (
        <div>
            <div
                className="start-measure-text-control"
                style={{display: "flex", justifyContent: "space-between"}}
            >
                <TextField
                    onChange={props.setValue(
                        getPropertyName<IRangeMeasureFormComponentField>(v => v.endPosition),
                        getPropertyNameToLower<IStartMeasureState>(v => v.rangeState)
                    )}
                    defaultValue={props.data.endPosition || undefined}
                    style={{width: "230px", height: "70px"}}
                    id="standard-basic"
                    type={"number"}
                    required={true}
                    error={props.actionResultView !== "" && (props.data.endPosition <= 180 || props.data.endPosition >= 1000)}
                    helperText={
                        (props.actionResultView !== "" && (props.data.endPosition <= 180 || props.data.endPosition >= 1000))
                            ? "Диапозоне от 180 до 1000 нм"
                            : ""
                    }
                    key={getPropertyNameToLower<IRangeMeasureFormComponentField>(v => v.endPosition)}
                    label="Конечное положение (нм):"
                    variant="standard" />
                <div  style={{ width: "230px", marginTop: "-6px" }}>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        Скорость вращения
                    </InputLabel>
                    <NativeSelect
                        style={{width: "230px"}}
                        inputProps={{
                            name: 'age',
                            id: 'uncontrolled-native',
                        }}
                        onChange={props.setValue(
                            getPropertyName<IRangeMeasureFormComponentField>(v => v.speed),
                            getPropertyNameToLower<IStartMeasureState>(v => v.rangeState)
                        )}
                        defaultValue={10}
                        key={getPropertyNameToLower<IRangeMeasureFormComponentField>(v => v.speed)}
                    >
                        <option value={5}>1,00 нм/с</option>
                        <option value={8}>0,63 нм/с</option>
                        <option value={10}>0,50 нм/с</option>
                        <option value={12}>0,42 нм/с</option>
                        <option value={15}>0,33 нм/с</option>
                        <option value={20}>0,25 нм/с</option>
                    </NativeSelect>
                </div>
            </div>
            <div className="start-measure-text-control">
                <TextField
                    onChange={props.setValue(
                        getPropertyName<IRangeMeasureFormComponentField>(v => v.step),
                        getPropertyNameToLower<IStartMeasureState>(v => v.rangeState)
                    )}
                    required={true}
                    defaultValue={props.data.step || undefined}
                    error={props.actionResultView !== "" && props.data.step <= 0}
                    helperText={
                        (props.actionResultView !== "" && props.data.step <= 0)
                            ? "Значение должно быть больше 0"
                            : ""
                    }
                    style={{width: "230px", height: "70px"}}
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
                    defaultValue={props.data.count || undefined}
                    helperText={
                        (props.actionResultView !== "" && props.data.count <= 0)
                            ? "Значение должно быть больше 0"
                            : ""
                    }
                    error={props.actionResultView !== "" && props.data.count <= 0}
                    style={{width: "230px", height: "70px"}}
                    id="standard-basic"
                    type={"number"}
                    key={getPropertyNameToLower<IRangeMeasureFormComponentField>(v => v.count)}
                    label="Кол-во измерений в точке"
                    variant="standard" />
            </div>
        </div>
    )
}
