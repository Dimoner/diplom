import React, { ChangeEvent } from "react";
import { Button, CircularProgress, FormGroup, TextareaAutosize, TextField } from "@mui/material";
import "../Style/start-measure.style.scss";
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

export default function StartMeasure(props: IStartMeasureProps) {
    const [isLoad, setLoad] = React.useState(false);
    const [actionResultView, setActionResultView] = React.useState("");
    const [actionResultViewSuccess, setActionResultViewSuccess] = React.useState(false);

    const [mainFrom, setMainForm] = React.useState<IStartMeasureState>(defaultValue);

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
                <div className="start-measure-text-control">
                    <TextField
                        onChange={setValueForForm(getPropertyNameToLower<IStartMeasureState>(v => v.currentPosition))}
                        style={{ width: "330px" }}
                        id="standard-basic"
                        type={"number"}
                        required={true}
                        error={actionResultView !== "" && mainFrom.currentPosition <= 0}
                        key={getPropertyNameToLower<IStartMeasureState>(v => v.currentPosition)}
                        label="Текущие положение (нм):"
                        variant="standard"/>
                </div>
                <div className="start-measure-text-control">
                    <TextField
                        onChange={setValueForForm(getPropertyNameToLower<IStartMeasureState>(v => v.startPosition), )}
                        style={{ width: "330px" }}
                        key={getPropertyNameToLower<IStartMeasureState>(v => v.startPosition)}
                        error={actionResultView !== "" && mainFrom.startPosition <= 0}
                        id="standard-basic"
                        type={"number"}
                        required={true}
                        label="Начальное положение (нм):"
                        variant="standard"/>
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
                            minWidth: 496,
                            maxWidth: 496,
                            minHeight: 200,
                            maxHeight: 200,
                            height: 200,
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
