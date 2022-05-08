import {
    Box,
    Button, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Divider, List, ListItem, ListItemText
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {MeasureStateManager} from "../StateManager/MeasureStateMaanger";
import {IAmperageState} from "../Pages/Amperage/Interfaces/AmperagePageInterfaces";
import "./Style/header.scss";
import { measureRangeInLocalStorageName, measureTimeInLocalStorageName } from "../Pages/Amperage/Amperage";
import { HubConnection } from "@microsoft/signalr";
import * as signalR from "@microsoft/signalr";
import moment from "moment";
import SettingComponent from "./Setting/SettingComponent";
import { useDispatch, useSelector } from "react-redux";
import { increment } from "../counterSlice";

const pathNavigation: { label: string, key: string }[] = [
    {
        label: "Токовый режим",
        key: "Amperage"
    },
    {
        label: "Счетный режим",
        key: "Count"
    },
    {
        label: "История",
        key: "History"
    }
];

export interface IStateSystemResponse {
    actionType: number,
    measureCount: number,
    voltage: number,
    position: number,
    resistance: string,
    capacitance: string,
}

export interface IStateSystem extends IStateSystemResponse {
    updateDate: string
}

const defaultStateSystem: IStateSystem = {
    actionType: 0,
    measureCount: 0,
    voltage: 0,
    position: 0,
    resistance: "",
    capacitance: "",
    updateDate: ""
}

export default function Header() {
    const [stateSystem, setStateSystem] = React.useState<IStateSystem>(defaultStateSystem);
    const dispatch = useDispatch()
    // важно для перерендера при изменении localstorage
    const dima = useSelector((state: any) => state.counter.dima)
    
    const hubConnection = useRef<HubConnection>(new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5000/state")
        .configureLogging(signalR.LogLevel.Information)
        .build());

    useEffect(() => {
        hubConnection.current.start().then(a => {
            hubConnection.current.on("state", (data: IStateSystemResponse) => {
                setStateSystem(prev => ({
                    ...data,
                    updateDate: moment().format("HH:mm:ss")
                }))
            });
        });

        return () => {
            hubConnection.current.stop();
        };
    }, []);

    const [value, setValue] = React.useState(-1);

    const navigate = useNavigate();
    const location = useLocation();

    const [open, setOpen] = React.useState<number>(-1);
    const [openSetting, setOpenSetting] = React.useState<boolean>(false);
    const [awaitResponse, setAwaitResponse] = React.useState<boolean>(false);

    useEffect(() => {
        const navigateValue = pathNavigation.findIndex(key => location.pathname.toLowerCase().includes(key.key.toLowerCase()));
        if (navigateValue !== undefined) {
             setValue(navigateValue);
        }
    }, []);

    const relocateAction = (newValue: number) => {
        setValue(newValue);
        const navigateValue: string = pathNavigation[newValue].key.toLowerCase()
        navigate(navigateValue, {replace: true})
    }

    const handleChange = (newValue: number) => {
        if (MeasureStateManager.IsMeasure){
            setOpen(newValue);
            return;
        }
        relocateAction(newValue);
    };

    const clearMeasureInStorageId = (measureInLocalStorageName: string) => {
        const existHistory: string | null = localStorage.getItem(measureInLocalStorageName)
        if (existHistory !== undefined && existHistory !== "" && existHistory !== null){
            const parseHistory: IAmperageState = JSON.parse(existHistory)
            parseHistory.measureId = "0";
            localStorage.setItem(measureInLocalStorageName, JSON.stringify(parseHistory))
        }
    }

    const handleClose = (isCancel: boolean) => {
        if(isCancel){
            setOpen(-1)
            return;
        }

        setAwaitResponse(true)
        fetch(`http://localhost:5000/control-measure/stop`).then(() => {
            MeasureStateManager.IsMeasure = false;
            clearMeasureInStorageId(measureRangeInLocalStorageName);
            clearMeasureInStorageId(measureTimeInLocalStorageName);
            relocateAction(open)
            setOpen(-1)
        }).finally(() => {
            setAwaitResponse(false)
        })
    };

    return (
        <div className="header-main">
            <Box
                role="presentation"
            >
                <DialogTitle id="alert-dialog-title">
                    Режимы:
                </DialogTitle>
                <Divider />
                <List>
                    {pathNavigation.map((item, index) =>{
                        return (
                            <ListItem
                                button key={item.key}
                                style={index === value ? {background:" rgba(25, 118, 210, 0.12)", borderRadius: "8px"}: {}}
                                onClick={() => handleChange(index)}>
                                <ListItemText primary={item.label} />
                            </ListItem>
                        )
                    })}
                    <ListItem
                        button key="setting"
                        disabled={MeasureStateManager.IsMeasure}
                        onClick={() => {
                            setOpenSetting(true)
                        }}>
                        <ListItemText primary="Настройки" />
                    </ListItem>
                </List>
                <Divider />
                <DialogTitle id="alert-dialog-title">
                    Состояние:
                </DialogTitle>
                <div style={{marginBottom: "20px"}}>
                    <div className="state-group-title">
                        Дата обновления:
                    </div>
                    <div className="state-group-text" style={{marginTop: "5px"}}>
                        {stateSystem.updateDate}
                    </div>
                </div>
                <div className="state-group">
                    <div className="state-group-title">
                        Режим:
                    </div>
                    <div className="state-group-text">
                        {stateSystem.actionType === 3 ? "Токовый" : "Счетный"}
                    </div>
                </div>
                <div className="state-group">
                    <div className="state-group-title">
                       Значение:
                    </div>
                    <div className="state-group-text">
                        {stateSystem.measureCount}
                    </div>
                </div>
                <div className="state-group">
                    <div className="state-group-title">
                        Позиция:
                    </div>
                    <div className="state-group-text">
                        {stateSystem.position},нм
                    </div>
                </div>
                <div className="state-group">
                    <div className="state-group-title">
                        R:
                    </div>
                    <div className="state-group-text">
                        {stateSystem.resistance}{" Ом"}
                    </div>
                </div>
                <div className="state-group">
                    <div className="state-group-title">
                        C:
                    </div>
                    <div className="state-group-text">
                        {stateSystem.capacitance}{" Ф"}
                    </div>
                </div>
                <div className="state-group" style={{marginBottom: "20px"}}>
                    <div className="state-group-title">
                        U на ФЭУ:
                    </div>
                    <div className="state-group-text">
                        {stateSystem.voltage}{" В"}
                    </div>
                </div>
                <Divider />
                <DialogTitle id="alert-dialog-title">
                    Действия:
                </DialogTitle>
                <div style={{paddingLeft: 5, paddingBottom: 17}}>
                    <Button
                        onClick={() => {
                            setOpen(value)
                        }}
                        style={{width: "130px"}}
                        variant="contained"
                        color="error">
                        Сбросить
                    </Button>
                </div>
            </Box>

            <Dialog
                open={open !== -1}
                onClose={() => handleClose(true)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                   Уведомление!
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Вы уверены, что хотите сбросить состояние устрйоства?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{height: "70px"}} onClick={() => handleClose(true)}>Отменить</Button>
                    <Button style={{height: "70px", marginRight: "20px"}} onClick={() => handleClose(false)} autoFocus>
                        {awaitResponse ? <CircularProgress style={{marginRight: "20px"}}/> : "Сбросить"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                fullWidth={true}
                maxWidth="sm"
                open={openSetting}
                onClose={() => {
                    dispatch(increment())
                    setOpenSetting(false)
                }}
            >
                <SettingComponent
                    closeSetting={() => {
                        dispatch(increment())
                        setOpenSetting(false)
                    }}
                />
            </Dialog>
        </div>
    );
}
