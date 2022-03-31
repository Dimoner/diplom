import React, {useEffect, useRef, useState} from "react";
import {Slider, ToggleButton, ToggleButtonGroup} from "@mui/material";
import './Style/amperage.style.scss'
import ChartComponent from "../../Components/Chart/AmperageChart";
import Actions from "../../Components/Actions";
import {IStartMeasureData} from "../../Interfaces/IStartMeasureData";
import {HubConnection} from "@microsoft/signalr";
import * as signalR from "@microsoft/signalr";
import {IAmperageMarks} from "../../Interfaces/IAmperageMarks";
import LastMeasureComponent from "../Components/LastMeasureComponent";
import DialogComponent from "../Components/DialogComponent";
import {TSubType} from "../../Types/Types";
import {IAmperageState, IMeasureItem} from "./Interfaces/AmperagePageInterfaces";

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
        isMeasure: "false",
        open: false,
        alignment: 'range'
    });

    useEffect(() => {
        hubConnection.current.start().then(a => {
            console.log(a)
        });

        window.onbeforeunload = function() {
            hubConnection.current.stop();
            return "Данные не сохранены. Точно перейти?";
        };

        return () => {
            // TODO отправить команду стоп
            hubConnection.current.stop();
        };
    }, []);

    const action = (message: string) => {
        console.log(message);
       /* const valueList = message.split("-");
        if(valueList[1] === "STOP"){
            setStateAmperage(prev => ({
                ...prev,
                isMeasure: "false",
                open: true
            }))
            return;
        }

        const waveLength = Number(valueList[1]);
        const amperage = Number(valueList[2]);
        setStateAmperage(prev => ({
            ...prev,
           measureList : [{waveLength, amperage}, ...prev.measureList],
           amperageMarks : {marks: [...prev.amperageMarks.marks], value: ((waveLength - prev.startWave) * 100 / prev.rangeWave), maxMave: prev.amperageMarks.maxMave}
        }))*/
    };

    useEffect(() => {
        if (hubConnection?.current !== null) {
            if (stateAmperage.isMeasure === "false") {
                hubConnection.current.off("AMP");
                return;
            }
            hubConnection.current.on("AMP", action);
        }
    }, [stateAmperage.isMeasure]);

    const startMeasureAction = (startMeasure: IStartMeasureData) => {
        const sub = startMeasure.endPosition - startMeasure.startPosition;
        const newMarks: IAmperageMarks[] = [
            {value: 0, label: startMeasure.startPosition.toString()},
            ...[10, 20, 30, 40, 50, 60, 70, 80, 90].map((value: number, index: number) => {
                return {
                    value: value,
                    label: (startMeasure.startPosition + ((sub / 10) * (index + 1))).toFixed(0).toString()
                }
            }),
            {value: 100, label: startMeasure.endPosition.toString()}]

        setStateAmperage(prev => ({
            ...prev,
            measureList: [],
            rangeWave: sub,
            startWave: startMeasure.startPosition,
            amperageMarks: {marks: [...newMarks], value: 0, maxMave: startMeasure.endPosition},
            isMeasure: "true"
        }))
    }

    return (
        <div>
            <div className="amperage-container">
                <div className="amperage-container-left">
                    <div className="amperage-container-left-action">
                        <ToggleButtonGroup
                            color="primary"

                            value={stateAmperage.alignment}
                            exclusive
                            onChange={(event: any, newAlignment: TSubType) => {
                                setStateAmperage(prev => ({
                                    ...prev,
                                    alignment: newAlignment
                                }))
                            }}
                        >
                            <ToggleButton value="range">Длина волны/ток</ToggleButton>
                            <ToggleButton value="time">Время/ток</ToggleButton>
                        </ToggleButtonGroup>
                        <Actions startMeasure={startMeasureAction} type={"amp"} subType={stateAmperage.alignment} />
                    </div>
                    <LastMeasureComponent measure={stateAmperage.measureList} leftName={stateAmperage.alignment === "time" ? "t, сек" : "h, Нм"} rightName={"I, Ам"}/>
                </div>

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
                            measure={stateAmperage.measureList.map(value => ({xValue: value.waveLength, yValue: value.amperage}))}
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
