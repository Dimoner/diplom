import React from "react";
import {Button, CircularProgress, TextField} from "@mui/material";
import "../Style/start-measure.style.scss";
import {TSubType, TType} from "../../../Types/Types";
import RangeMeasureFormComponent from "./StartMeasureComponent/RangeMeasureFormComponent";
import TimeMeasureFormComponent from "./StartMeasureComponent/TimeMeasureFormComponent";
import {IErrorResponse} from "../../../Error/IErrorResponse";
import {IStartMeasureRequest, IStartMeasureResponse, IStartMeasureState} from "./Interfaces/StartMeasureInterfaces";

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

        let response = await fetch(`http://localhost:5000/logic/${props.subType === "time" ? 'start-detect-time' : 'start-detect-range'}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

        if (response.status == 400) {
            const result: IErrorResponse = await response.json()
            setLoad(false);
            setActionResultViewSuccess(false)
            setActionResultView(result.errorText);
            return;
        }

        if (response.ok) {
            const result: {measureId: number} = await response.json();
            const response: IStartMeasureResponse = {
                ...result,
                ...requestBody
            }
            setActionResultViewSuccess(true)
            props.startMeasure(response);
            return;
        }

        setLoad(false);
        setActionResultViewSuccess(false)
        setActionResultView("Произошла неизвестная ошибка");
    };

    return (
        <div className="start-measure">
            <div className="start-measure-text">
                <div className="start-measure-text-title">
                    Описание действия:
                </div>
                <div className="start-measure-text-simple">
                    Измерение
                </div>
                <div className="start-measure-text-control">
                    <TextField
                        onChange={(value) => {
                            setMainForm((prev: any) => ({
                                ...prev,
                                currentPosition: Number(value.target.value || 0)
                            }));
                        }}
                        style={{width: "230px"}}
                        id="standard-basic"
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
                        style={{width: "230px"}}
                        id="standard-basic"
                        label="Начальное положение (нм):"
                        variant="standard"/>
                </div>
                {
                    props.subType === "range"
                        ? <RangeMeasureFormComponent
                            setValue={(value, name) => setRangeForm(prev => ({
                                ...prev,
                                [name]: value
                            }))}
                            count={mainFrom.rangeState.count}
                            endPosition={mainFrom.rangeState.endPosition}
                            step={mainFrom.rangeState.step}
                        />
                        : <TimeMeasureFormComponent
                            setValue={(value, name) => setTimeForm(prev => ({
                                ...prev,
                                [name]: value
                            }))}
                            delay={mainFrom.timeState.delay}
                            num={mainFrom.timeState.num}
                            frequency={mainFrom.timeState.frequency}
                        />
                }
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
