import React from "react";
import { Button, CircularProgress, TextareaAutosize, TextField } from "@mui/material";
import "../Style/start-measure.style.scss";
import {TSubType, TType} from "../../../Types/Types";
import RangeMeasureFormComponent from "./StartMeasureComponent/RangeMeasureFormComponent";
import TimeMeasureFormComponent from "./StartMeasureComponent/TimeMeasureFormComponent";
import {IErrorResponse} from "../../../Error/IErrorResponse";
import {
    IStartMeasureRequest,
    IStartMeasureResponse,
    IStartMeasureState
} from "./Interfaces/StartMeasureInterfaces";

export interface IStartMeasureProps {
    startMeasure: (startMeasure: IStartMeasureResponse) => void,
    type: TType,
    subType: TSubType
}

export default function StartMeasure(props: IStartMeasureProps) {
    const [isLoad, setLoad] = React.useState(false);
    const [actionResultView, setActionResultView] = React.useState("");
    const [actionResultViewSuccess, setActionResultViewSuccess] = React.useState(false);

    const [mainFrom, setMainForm] = React.useState<IStartMeasureState>({
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
    });

    const sendRequest = async () => {
        setLoad(true);
        setActionResultViewSuccess(false)
        setActionResultView("");

        let requestBody: IStartMeasureRequest = {
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
        const response = await fetch(uri,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

        const responseBody: IErrorResponse | {measureId: number} = await response.json()
        if (response.status == 400) {
            setLoad(false);
            setActionResultViewSuccess(false)
            setActionResultView((responseBody as IErrorResponse).errorText);
            return;
        }

        if (response.ok) {
            const result: IStartMeasureResponse = {
                ...(responseBody as {measureId: number}),
                ...requestBody
            }
            props.startMeasure(result);
            return;
        }

        setLoad(false);
        setActionResultViewSuccess(false)
        setActionResultView("Произошла неизвестная ошибка");
    };

    return (
        <div className="start-measure">
            <div className="start-measure-text">
                <div className="start-measure-text-control measure-description">
                    <div className="measure-description--text">
                        Название измерения:
                    </div>
                    <TextField
                        onChange={(value) => {
                            setMainForm((prev: any) => ({
                                ...prev,
                                measureName: value.target.value
                            }));
                        }}
                        style={{width: "330px"}}
                        id="standard-basic"
                        placeholder="Введите название..."
                        variant="standard"/>
                </div>
                <div style={{ marginTop: 22 }}>
                   Технические характеристики измерения:
                </div>
                <div className="start-measure-text-control">
                    <TextField
                        onChange={(value) => {
                            setMainForm((prev: any) => ({
                                ...prev,
                                currentPosition: Number(value.target.value || 0)
                            }));
                        }}
                        style={{width: "330px"}}
                        id="standard-basic"
                        type={"number"}
                        label="Текущие положение (нм):"
                        variant="standard"/>
                </div>
                <div className="start-measure-text-control">
                    <TextField
                        onChange={(value) => {
                            setMainForm((prev: any) => ({
                                ...prev,
                                startPosition: Number(value.target.value || 0)
                            }));
                        }}
                        style={{width: "330px"}}
                        id="standard-basic"
                        type={"number"}
                        label="Начальное положение (нм):"
                        variant="standard"/>
                </div>
                {
                    props.subType === "range"
                        ? <RangeMeasureFormComponent
                            setValue={(value, name) => {
                                if(mainFrom.rangeState !== undefined)
                                {
                                    mainFrom.rangeState[name] = value
                                }

                                setMainForm({...mainFrom})
                            }}
                            count={mainFrom.rangeState?.count || 0}
                            endPosition={mainFrom.rangeState?.endPosition || 0}
                            step={mainFrom.rangeState?.step || 0}
                        />
                        : <TimeMeasureFormComponent
                            setValue={(value, name) => {
                                if(mainFrom.timeState !== undefined)
                                {
                                    mainFrom.timeState[name] = value
                                }

                                setMainForm({...mainFrom})
                            }}
                            delay={mainFrom.timeState?.delay || 0}
                            num={mainFrom.timeState?.num || 0}
                            frequency={mainFrom.timeState?.frequency || 0}
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
                        onChange={(value) => {
                            setMainForm((prev: any) => ({
                                ...prev,
                                description: value.target.value
                            }));
                        }}
                        style={{ width: 496, minWidth: 496, maxWidth: 496, minHeight: 200, maxHeight: 200, height: 200, padding: 5 }}
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
                <div className="start-measure-result" style={{color: actionResultViewSuccess ? "green" : "red"}}>
                    {actionResultView}
                </div> : ""}
        </div>
    )
}
