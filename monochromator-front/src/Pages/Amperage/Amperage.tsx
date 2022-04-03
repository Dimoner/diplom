import React, {useEffect, useRef, useState} from "react";
import {Slider} from "@mui/material";
import './Style/amperage.style.scss'
import ChartComponent from "../../Components/Chart/AmperageChart";
import {HubConnection} from "@microsoft/signalr";
import * as signalR from "@microsoft/signalr";
import DialogComponent from "../Components/DialogComponent";
import { IAmperageState, IMeasureElemMqttResponse } from "./Interfaces/AmperagePageInterfaces";
import AmperageActionBlock from "./Components/AmperageActionBlock";
import {MeasureStateManager} from "../../StateManager/MeasureStateMaanger";

export const measureInLocalStorageName: string = "measure";

export default function Amperage() {
    const hubConnection = useRef<HubConnection>(new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5000/measure")
        .configureLogging(signalR.LogLevel.Information)
        .build());

    const [stateAmperage, setStateAmperage] = useState<IAmperageState>({
        measureList: [],
        amperageMarks: {marks: [], value: 0, maxMave: 0},
        rangeWave: 0,
        startWave: 0,
        measureId: "0",
        open: false,
        alignment: 'range'
    });

    const [dima, setDima] = useState<string>("");

    useEffect(() => {
        hubConnection.current.start().then(a => {
            console.log(a)
        });
        const existHistory: string | null = localStorage.getItem(measureInLocalStorageName)
        if (existHistory !== undefined && existHistory !== "" && existHistory !== null){
            const parseHistory: IAmperageState = JSON.parse(existHistory)
            setStateAmperage(prev => parseHistory)
            setDima(Math.random().toString())
        }

        return () => {
            hubConnection.current.stop();
        };
    }, []);

    const action = (message: IMeasureElemMqttResponse) => {
        setStateAmperage(prev => {
            if(message.isStop){
                hubConnection.current.off(message.id.toString());
                MeasureStateManager.IsMeasure = false;
                window.onbeforeunload = () => undefined
                prev.measureId = "0"
                localStorage.setItem(measureInLocalStorageName, JSON.stringify(prev))
                return {...prev};
            }

            MeasureStateManager.IsMeasure = true;

            const result = {
                ...prev,
                measureList: [{ x: message.x, y: message.y }, ...prev.measureList],
                amperageMarks: {
                    marks: [...prev.amperageMarks.marks],
                    value: ((message.x - prev.startWave) * 100 / prev.rangeWave),
                    maxMave: prev.amperageMarks.maxMave
                }
            }
            localStorage.setItem(measureInLocalStorageName, JSON.stringify(result))
            return result;
        })
        setDima(Math.random().toString())
    };

    useEffect(() => {
        if (hubConnection?.current !== null && hubConnection?.current !== undefined && stateAmperage.measureId !== "0") {
            hubConnection.current.on(stateAmperage.measureId, action);
            window.onbeforeunload = function() {
                return "Измерение еще не завершено, вы уверены, что хотите закрыть приложение?";
            };
        }
    }, [stateAmperage.measureId]);

    return (
        <div>
            <div className="amperage-container">
               <AmperageActionBlock
                   alignment={stateAmperage.alignment}
                   setStateAmperage={setStateAmperage}
                   measureList={stateAmperage.measureList}
               />
                <div className="amperage-loader">
                    <div style={{width: "350px"}}>
                        <Slider
                            aria-label="Custom marks"
                            value={stateAmperage.amperageMarks.value}
                            disabled={true}
                            getAriaValueText={(value: any) => {
                                return `${value * stateAmperage.amperageMarks.maxMave / 100}, нм`
                            }}
                            valueLabelDisplay="off"
                            getAriaLabel={(value: any) => {
                                return `${value * stateAmperage.amperageMarks.maxMave / 100}, нм`
                            }}
                            marks={stateAmperage.amperageMarks.marks}
                        />
                    </div>
                    <div style={{marginTop: "40px", display: "flex", justifyContent: "center"}}>
                        <ChartComponent
                            measure={stateAmperage.measureList}
                            xFormatter={(seriesName: number) => `Длина волны: ${seriesName}, нм`}
                            yFormatter={(val: number, opts?: any) => `${val}, Ам`}
                            yTitleFormatter={value => "Ток:"}
                        />
                    </div>
                </div>
            </div>
           <DialogComponent
               onClickAction={() => {
                   setStateAmperage(prev => ({
                       ...prev,
                       open: false
                   }))
               }}
               onCloseAction={() => {
                   setStateAmperage(prev => ({
                       ...prev,
                       open: false
                   }))
               }}
               openState={stateAmperage.open}/>
        </div>
    );
}
