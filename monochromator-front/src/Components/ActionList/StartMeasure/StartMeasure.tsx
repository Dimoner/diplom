import React, { ChangeEvent } from "react";
import { Button, CircularProgress, FormGroup, TextareaAutosize, TextField } from "@mui/material";
import "../Style/start-measure.scss";
import { TSubType, TType } from "../../../Types/Types";
import RangeMeasureFormComponent from "./StartMeasureComponent/RangeMeasureFormComponent";
import TimeMeasureFormComponent from "./StartMeasureComponent/TimeMeasureFormComponent";
import { IStartMeasureRequest, IStartMeasureResponse, IStartMeasureState } from "./Interfaces/StartMeasureInterfaces";
import { getPropertyNameToLower } from "../../../Helpers/PropertyName";
import { HttpServiceHelper } from "../../../Helpers/HttpServiceHelper";
import { BaseControlItem } from "../../Base/ControlItem";

export interface IStartMeasureProps {
    startMeasure: (startMeasure: IStartMeasureResponse) => void,
    type: TType,
    subType: TSubType
}

export const actionAmperageRange: string = "amperage-range";
export const actionAmperageTime: string = "amperage-time";

export const actionTickRange: string = "tick-range";
export const actionTickTime: string = "tick-time";

const defaultValue: IStartMeasureState = {
    currentPosition: 0,
    startPosition: 0,
    description: "",
    measureName: "",
    rangeState: {
        endPosition: 0,
        step: 0,
        count: 0,
    },
    timeState: {
        delay: 0,
        num: 0,
        frequency: 0
    }
};

const getFormName = (type: TType, subType: TSubType): string => {
    if (type === "amp" && subType === "range"){
        return actionAmperageRange;
    }

    if (type === "amp" && subType === "time"){
        return actionAmperageTime;
    }

    if (type === "count" && subType === "range"){
        return actionTickRange;
    }

    if (type === "count" && subType === "range"){
        return actionTickTime;
    }

    return "";
}

const getDefaultValue = (type: TType, subType: TSubType):IStartMeasureState  => {
    const name = getFormName(type, subType);
    const item = localStorage.getItem(name);
    if(item === undefined || item === "" || item === null){
        return {...defaultValue}
    }

    const value: IStartMeasureState = JSON.parse(item);
    return value;
}

export default function StartMeasure(props: IStartMeasureProps) {
    const [isLoad, setLoad] = React.useState(false);
    const [actionResultView, setActionResultView] = React.useState("");
    const [actionResultViewSuccess, setActionResultViewSuccess] = React.useState(false);

    const [mainFrom, setMainForm] = React.useState<IStartMeasureState>(getDefaultValue(props.type, props.subType));

    const savePrevForm = () => {
        const form = {...mainFrom}
        form.measureName = "";
        form.description = "";
        const jsonFormat = JSON.stringify(form);
        const name = getFormName(props.type, props.subType)
        localStorage.setItem(name, jsonFormat);
    }

    const sendRequest = async () => {
        setLoad(true);
        setActionResultViewSuccess(false)
        setActionResultView("");

        const requestBody: IStartMeasureRequest = {
            actionType: props.type === "amp" ? 3 : 4,
            currentPosition: mainFrom.currentPosition,
            startPosition: mainFrom.startPosition,
            description: mainFrom.description,
            measureName: mainFrom.measureName,
            endPosition: mainFrom.rangeState?.endPosition,
            step: mainFrom.rangeState?.step,
            count: mainFrom.rangeState?.count,
            delay: mainFrom.timeState?.delay,
            num: mainFrom.timeState?.num,
            frequency: mainFrom.timeState?.frequency
        }

        const uri = `http://localhost:5000/logic/${props.subType === "time" ? 'start-detect-time' : 'start-detect-range'}`;

        const response = await HttpServiceHelper.SendPostRequest<IStartMeasureRequest, { measureId: number }>(uri, requestBody);
        if (response.errorBody === undefined) {
            savePrevForm();
            const result: IStartMeasureResponse = {
                ...(response.body as { measureId: number }),
                ...requestBody
            }
            props.startMeasure(result);
            return;
        }

        setLoad(false);
        setActionResultViewSuccess(false)
        setActionResultView(response.errorBody?.errorText || "Произошла неизвестная ошибка");
    };

    const setValueForForm = (name: string, innerName: string = "") => (value: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let valueCurrent: string | number = value.target.value;
        if (
            name !== getPropertyNameToLower<IStartMeasureState>(v => v.description) &&
            name !==getPropertyNameToLower<IStartMeasureState>(v => v.measureName)
        )
        {
            valueCurrent = Number(value.target.value)
        }

        if(innerName !== ""){
            setMainForm((prev: any) => ({
                ...prev,
                [innerName]: {
                    ...prev[innerName],
                    [name]: valueCurrent
                }
            }));
            return;
        }

        setMainForm((prev: any) => ({
            ...prev,
            [name]: valueCurrent
        }));
    }

    return (
        <div className="start-measure">
            <div className="start-measure-text">
                <div className="start-measure-text-control measure-description">
                    <div className="measure-description--text">
                        Название измерения:
                    </div>
                    <TextField
                        onChange={setValueForForm(getPropertyNameToLower<IStartMeasureState>(v => v.measureName))}
                        style={{ width: "330px" }}
                        id="standard-basic"
                        error={actionResultView !== "" && mainFrom.measureName === ""}
                        required={true}
                        label="Название измерения"
                        key={getPropertyNameToLower<IStartMeasureState>(v => v.measureName)}
                        variant="standard"/>
                </div>
                <div style={{ marginTop: 22 }}>
                    Технические характеристики измерения:
                </div>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <div className="start-measure-text-control">
                        <TextField
                            onChange={setValueForForm(getPropertyNameToLower<IStartMeasureState>(v => v.currentPosition))}
                            defaultValue={mainFrom.currentPosition || undefined}
                            style={{ width: "230px", height: "80px", marginBottom: 0 }}
                            id="standard-basic"
                            type={"number"}
                            required={true}
                            error={actionResultView !== "" && (mainFrom.currentPosition <= 180 || mainFrom.currentPosition >= 1000)}
                            helperText={
                                ( actionResultView !== "" && (mainFrom.currentPosition <= 180 || mainFrom.currentPosition >= 1000))
                                    ? "Диапозоне от 180 до 1000 нм"
                                    : ""
                            }
                            key={getPropertyNameToLower<IStartMeasureState>(v => v.currentPosition)}
                            label="Текущие положение (нм):"
                            variant="standard"/>
                    </div>
                    <div className="start-measure-text-control">
                        <TextField
                            onChange={setValueForForm(getPropertyNameToLower<IStartMeasureState>(v => v.startPosition), )}
                            style={{ width: "230px", height: "80px", marginBottom: 0 }}
                            key={getPropertyNameToLower<IStartMeasureState>(v => v.startPosition)}
                            error={actionResultView !== "" && (mainFrom.startPosition <= 180 || mainFrom.startPosition >= 1000)}
                            id="standard-basic"
                            type={"number"}
                            required={true}
                            defaultValue={mainFrom.startPosition || undefined}
                            helperText={
                                ( actionResultView !== "" && (mainFrom.currentPosition <= 180 || mainFrom.currentPosition >= 1000))
                                    ? "Диапозоне от 180 до 1000 нм"
                                    : ""
                            }
                            label="Начальное положение (нм):"
                            variant="standard"/>
                    </div>
                </div>

                {
                    props.subType === "range"
                        ? <RangeMeasureFormComponent
                            setValue={setValueForForm}
                            actionResultView={actionResultView}
                            data={mainFrom.rangeState}
                        />
                        : <TimeMeasureFormComponent
                            setValue={setValueForForm}
                            actionResultView={actionResultView}
                            data={mainFrom.timeState}
                        />
                }
                <div className="start-measure-text-control-description">
                    Описание измерения:
                </div>
                <div className="start-measure-text-control">
                    <TextareaAutosize
                        maxRows={4}
                        aria-labelledby="asdfsadf"
                        aria-label="maximum height"
                        placeholder="Введите текст...."
                        onChange={setValueForForm(getPropertyNameToLower<IStartMeasureState>(v => v.description))}
                        key={getPropertyNameToLower<IStartMeasureState>(v => v.description)}
                        style={{
                            width: 496,
                            margin: 0,
                            minWidth: 496,
                            maxWidth: 496,
                            minHeight: 150,
                            maxHeight: 150,
                            height: 150,
                            padding: 5
                        }}
                    />
                </div>
            </div>
            <div className="start-measure-action">
                {
                    !isLoad
                        ? <Button onClick={sendRequest} variant="outlined">Запрос</Button>
                        : <CircularProgress/>
                }
            </div>
            {!isLoad && actionResultView !== "" ?
                <div className="start-measure-result" style={{ color: actionResultViewSuccess ? "green" : "red" }}>
                    {actionResultView}
                </div> : ""}
        </div>
    )
}
