import React from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import "./Style/change-position.scss"
import { IErrorResponse } from "../../Helpers/HttpServiceHelper";

interface IPosition {
    startPosition: number,
    endPosition: number,
    view: string,
    isSuccess: boolean,
    isLoad: boolean
}

export default function ChangePosition() {
    const [statePosition, setStatePosition] = React.useState<IPosition>({
        startPosition: 0,
        endPosition: 0,
        view: "",
        isSuccess: false,
        isLoad: false
    });

    const sendRequest = async () => {
        if (statePosition.startPosition <= 0 || statePosition.endPosition <= 0) {
            setStatePosition(prev => {
                return {
                    ...prev,
                    view: "Ошибка валидации полей"
                }
            })
            return;
        }

        if (!statePosition.isLoad) {
            setStatePosition(prevState => ({
                ...prevState,
                isLoad: true,
                view: "",
                isSuccess: false
            }))

            let response = await fetch("http://localhost:5000/logic/change-position",
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        startPosition: statePosition.startPosition,
                        endPosition: statePosition.endPosition
                    })
                });

            if (response.status == 400) {
                const result: IErrorResponse = await response.json()
                setStatePosition(prevState => ({
                    ...prevState,
                    isLoad: false,
                    view: result.errorText,
                    isSuccess: false
                }))
                return;
            }

            if (response.ok) {
                setStatePosition(prevState => {
                    return {
                        ...prevState,
                        isLoad: false,
                        view: "Длина волны монохроматора изменена",
                        isSuccess: true,
                        startPosition: prevState.endPosition,
                        endPosition: 0
                    }
                })
                return;
            }

            setStatePosition(prevState => ({
                ...prevState,
                isLoad: false,
                view: "Произошла ошибка при изменении длины волны",
                isSuccess: false
            }))
        }
    };

    return (
        <div className="change-position">
            <div className="change-position-text">
                <div className="change-position-text-title">
                    Описание действия:
                </div>
                <div className="change-position-text-simple">
                    Перемещение монохроматора в нужное положение
                </div>
                <div className="change-position-text-control" style={{ height: "75px" }}>
                    <TextField
                        onChange={(value) => {
                            setStatePosition(prevState => ({ ...prevState, startPosition: Number(value.target.value) }))
                        }}
                        error={statePosition.view !== "" && (statePosition.startPosition <= 180 || statePosition.startPosition >= 1000)}
                        helperText={
                            (statePosition.view !== "" && (statePosition.startPosition <= 180 || statePosition.startPosition >= 1000))
                                ? "Диапозоне от 180 до 1000 нм"
                                : ""
                        }
                        value={statePosition.startPosition === 0 ? undefined : statePosition.startPosition}
                        style={{ width: "330px" }}
                        id="standard-basic"
                        label="Начальное положение (нм):"
                        required={true}
                        type={"number"}
                        variant="standard" />
                </div>
                <div className="change-position-text-control" style={{ height: "75px" }}>
                    <TextField
                        onChange={(value) => {
                            setStatePosition(prevState => ({ ...prevState, endPosition: Number(value.target.value) }))
                        }}
                        error={statePosition.view !== "" && (statePosition.endPosition <= 180 || statePosition.endPosition >= 1000)}
                        helperText={
                            (statePosition.view !== "" && (statePosition.endPosition <= 180 || statePosition.endPosition >= 1000))
                                ? "Диапозоне от 180 до 1000 нм"
                                : ""
                        }
                        value={statePosition.endPosition}
                        style={{ width: "330px" }}
                        id="standard-basic"
                        type={"number"}
                        required={true}
                        label="Конечное положение (нм):"
                        variant="standard" />
                </div>
            </div>
            <div className="change-position-action">
                {
                    !statePosition.isLoad
                        ? <Button onClick={sendRequest} variant="outlined">Запрос</Button>
                        : <CircularProgress />
                }
            </div>
            {!statePosition.isLoad && statePosition.view !== "" ?
                <div className="change-position-result" style={{ color: statePosition.isSuccess ? "green" : "red" }}>
                    {statePosition.view}
                </div> : ""}
        </div>
    )
}
