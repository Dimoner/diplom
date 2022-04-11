import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import "./Style/setting.scss"
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, TextField,
} from "@mui/material";

export interface ISettingComponent {
    closeSetting: () => void
}
export interface ISettingComponentState {
    amperageFunc: string,
    tickFunc: string,
    amperageName:string,
    tickName: string
}
export const settingFuncStorageConst = "setting-func"

export const defaultValueSettingComponentState : ISettingComponentState = {
    amperageFunc: "x",
    tickFunc: "x",
    amperageName: "у.е",
    tickName: "у.е."
};

export const defaultValueSettingComponentStateFunc = (): ISettingComponentState => {
    const getLocalStorageValue = localStorage.getItem(settingFuncStorageConst)
    if(getLocalStorageValue !== undefined && getLocalStorageValue !== "" && getLocalStorageValue !== null){
        const value: ISettingComponentState = JSON.parse(getLocalStorageValue as string);
        value.tickFunc = value.tickFunc || "x";
        value.amperageFunc = value.amperageFunc || "x";
        value.amperageName = value.amperageName || "у.е.";
        value.tickName = value.tickName || "у.е.";
        return value;
    }

    return {...defaultValueSettingComponentState}
}

const replaceFunc = (value: string) => value
    .replace("abs", "Math.abs")
    .replace("sin", "Math.sin")
    .replace("cos", "Math.cos")
    .replace("tan", "Math.tan")
    .replace("tanh", "Math.tanh")
    .replace("log", "Math.log")
    .replace("exp", "Math.exp")

export const useSettingFuncAction = (type: string, value: number): number => {
    const funcStore = defaultValueSettingComponentStateFunc();
    const currentFormat = replaceFunc(type === "amperage" ? funcStore.amperageFunc : funcStore.tickFunc).replace("x", value.toString())
    return Number(eval(currentFormat))
}

export default function SettingComponent({closeSetting}: ISettingComponent) {
    const [settingComponentState, setSettingComponentState] = useState<ISettingComponentState>(defaultValueSettingComponentStateFunc())

    useEffect(() => {
        localStorage.setItem(settingFuncStorageConst, JSON.stringify(settingComponentState))
    }, [settingComponentState])

    return (
        <div className="setting">
            <DialogTitle>Настройки математических преобразований</DialogTitle>
            <DialogContent>
                <Box
                    noValidate
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        m: 'auto',
                        width: 'fit-content',
                    }}
                >
                    <div className="addition-info">
                        <div className="addition-info-title">
                            Справочная информация:
                        </div>
                        <div className="addition-info-content">
                            <div className="addition-info-content-line">
                                <div className="block">
                                    <div className="addition-info-content-line-name">
                                        Операции:
                                    </div>
                                    <div className="addition-info-content-line-symbols">
                                        + - * /
                                    </div>
                                </div>
                                <div className="block" style={{marginLeft: "30px"}}>
                                    <div className="addition-info-content-line-name">
                                        Степень:
                                    </div>
                                    <div className="addition-info-content-line-symbols">
                                        **
                                    </div>
                                </div>
                                <div className="block" style={{marginLeft: "27px"}}>
                                    <div className="addition-info-content-line-name">
                                        Модуль:
                                    </div>
                                    <div className="addition-info-content-line-symbols">
                                        abs(x)
                                    </div>
                                </div>
                                <div className="block" style={{marginLeft: "30px"}}>
                                    <div className="addition-info-content-line-name">
                                        Синус:
                                    </div>
                                    <div className="addition-info-content-line-symbols">
                                        sin(x)
                                    </div>
                                </div>
                            </div>
                            <div className="addition-info-content-line">
                                <div className="block">
                                    <div className="addition-info-content-line-name">
                                        Косинус:
                                    </div>
                                    <div className="addition-info-content-line-symbols">
                                        cos(x)
                                    </div>
                                </div>
                                <div className="block" style={{marginLeft: "41px"}}>
                                    <div className="addition-info-content-line-name">
                                        Тангенс:
                                    </div>
                                    <div className="addition-info-content-line-symbols">
                                        tan(x)
                                    </div>
                                </div>
                                <div className="block" style={{marginLeft: "30px"}}>
                                    <div className="addition-info-content-line-name">
                                        Ктангенс:
                                    </div>
                                    <div className="addition-info-content-line-symbols">
                                        tanh(x)
                                    </div>
                                </div>
                            </div>
                            <div className="addition-info-content-line">
                                <div className="block">
                                    <div className="addition-info-content-line-name">
                                        Натуральный логарифм:
                                    </div>
                                    <div className="addition-info-content-line-symbols">
                                        log(x)
                                    </div>
                                </div>
                                <div className="block" style={{marginLeft: "69px"}}>
                                    <div className="addition-info-content-line-name">
                                        Экспонента:
                                    </div>
                                    <div className="addition-info-content-line-symbols">
                                        exp(x)
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="convertation">
                        <div className="addition-info-title">
                            Формулы конвертации (<b>x</b> - входное значение):
                        </div>
                        <div>
                            <TextField
                                onChange={(value) => {
                                    setSettingComponentState(prev => ({
                                        ...prev,
                                        amperageFunc: value.target.value
                                    }))
                                }}
                                style={{width: "330px"}}
                                id="standard-basic"
                                label="Конвертация токового сигнала"
                                defaultValue={settingComponentState.amperageFunc}
                                variant="standard"/>
                            <TextField
                                onChange={(value) => {
                                    setSettingComponentState(prev => ({
                                        ...prev,
                                        amperageName: value.target.value
                                    }))
                                }}
                                style={{width: "100px", marginLeft: "40px"}}
                                id="standard-basic"
                                defaultValue={settingComponentState.amperageName}
                                label="Название"
                                variant="standard"/>
                        </div>
                        <div>
                            <TextField
                                onChange={(value) => {
                                    setSettingComponentState(prev => ({
                                        ...prev,
                                        tickFunc: value.target.value
                                    }))
                                }}
                                style={{width: "330px"}}
                                id="standard-basic"
                                label="Конвертация счетного сигнала"
                                defaultValue={settingComponentState.tickFunc}
                                variant="standard"/>
                            <TextField
                                onChange={(value) => {
                                    setSettingComponentState(prev => ({
                                        ...prev,
                                        tickName: value.target.value
                                    }))
                                }}
                                style={{width: "100px", marginLeft: "40px"}}
                                id="standard-basic"
                                defaultValue={settingComponentState.tickName}
                                label="Название"
                                variant="standard"/>
                        </div>
                    </div>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeSetting}>Close</Button>
            </DialogActions>
        </div>
    )
}
