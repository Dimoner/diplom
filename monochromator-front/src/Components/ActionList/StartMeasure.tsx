import React from "react";
import {Button, CircularProgress, TextField} from "@mui/material";
import "./Style/start-measure.style.scss";
import {IStartMeasureData} from "../../Interfaces/IStartMeasureData";
import {TSubType, TType} from "../../Types/Types";
import RangeMeasureFormComponent, {IRangeMeasureFormComponentField} from "./StartMeasureComponent/RangeMeasureFormComponent";
import TimeMeasureFormComponent, {ITimeMeasureFormComponentField} from "./StartMeasureComponent/TimeMeasureFormComponent";
import {IErrorResponse} from "../../Error/IErrorResponse";

export interface IStartMeasureProps {
    startMeasure: (startMeasure: IStartMeasureData) => void,
    type: TType,
    subType: TSubType
}

interface IMainStartMeasureForm {
    currentPosition: number,
    startPosition: number
}

export default function StartMeasure(props: IStartMeasureProps) {
    const [isLoad, setLoad] = React.useState(false);
    const [actionResultView, setActionResultView] = React.useState("");
    const [actionResultViewSuccess, setActionResultViewSuccess] = React.useState(false);

    const [mainFrom, setMainForm] = React.useState<IMainStartMeasureForm>({currentPosition: 0, startPosition: 0})
    const [rangeForm, setRangeForm] = React.useState<IRangeMeasureFormComponentField>({
        count: 0,
        endPosition: 0,
        step: 0
    })

    const [timeForm, setTimeForm] = React.useState<ITimeMeasureFormComponentField>({ num: 0, delay: 0, frequency: 0})

    const sendRequest = async () => {
        setLoad(true);
        setActionResultViewSuccess(false)
        setActionResultView("");

        let requestBody = {
            ...mainFrom,
            actionType: props.type === "amp" ? 3 : 4
        }

        if (props.subType === "time"){
            requestBody = {
                ...requestBody,
                ...timeForm
            }
        }

        if (props.subType === "range"){
            requestBody = {
                ...requestBody,
                ...rangeForm
            }
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
           // setActionResultViewSuccess()
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
                            setMainForm(prev => ({
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
                            setMainForm(prev => ({
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
                            count={rangeForm.count}
                            endPosition={rangeForm.endPosition}
                            step={rangeForm.step}
                        />
                        : <TimeMeasureFormComponent
                            setValue={(value, name) => setTimeForm(prev => ({
                                ...prev,
                                [name]: value
                            }))}
                            delay={timeForm.delay}
                            num={timeForm.num}
                            frequency={timeForm.frequency}
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
