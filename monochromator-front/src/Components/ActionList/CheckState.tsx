import React from "react";
import {Button, CircularProgress} from "@mui/material";
import "./Style/check-state.style.scss"
import { IErrorResponse } from "../../Helpers/HttpServiceHelper";
export default function CheckState() {
    const [isLoad, setLoad] = React.useState(false);

    const [actionResultView, setActionResultView] = React.useState("");
    const [actionResultViewSuccess, setActionResultViewSuccess] = React.useState(false);

    const sendRequest = async () => {
        if (!isLoad){
            setLoad(true);
            setActionResultViewSuccess(false)
            setActionResultView("");

            let response = await fetch("http://localhost:5000/logic/check-state");
            setLoad(false);

            if(response.status == 400){
                const result: IErrorResponse = await response.json()
                setActionResultViewSuccess(false)
                setActionResultView(result.errorText);
                return;
            }

            if (response.ok) {
                setActionResultViewSuccess(true)
                setActionResultView("Устройство работает в штатном режиме");
                return;
            }

            setActionResultViewSuccess(false)
            setActionResultView("В 1 из компонентов ошибка");
        }
    };

    return(
        <div className="check-state">
            <div className="check-state-text">
                <div className="check-state-text-title">
                    Описание действия:
                </div>
                <div className="check-state-text-simple">
                    Нажатие данной кнопки отправит на сервер запрос для проверки состояния устройства
                </div>
                <div className="check-state-text-title">
                    Путь запрос:
                </div>
                <div className="check-state-text-simple">
                    {"Сервер -> ESP -> STM -> ESP -> Сервер"}
                </div>
            </div>
            <div className="check-state-action">
                {
                    !isLoad
                        ? <Button onClick={sendRequest} variant="outlined">Запрос</Button>
                        : <CircularProgress />
                }
            </div>
            {!isLoad && actionResultView !== "" ?
                <div className="check-state-result" style={{color: actionResultViewSuccess ? "green" : "red"}}>
                {actionResultView}
            </div> : ""}
        </div>
    )
}
