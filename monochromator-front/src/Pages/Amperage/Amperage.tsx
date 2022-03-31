import React, {useEffect, useRef, useState} from "react";
import {Slider, ToggleButton, ToggleButtonGroup} from "@mui/material";
import './Style/amperage.style.scss'
import ChartComponent from "../../Components/Chart/AmperageChart";
import {IAmperageSlider} from "../../Interfaces/IAmperageSlider";
import Actions from "../../Components/Actions";
import {IStartMeasureData} from "../../Interfaces/IStartMeasureData";
import {HubConnection} from "@microsoft/signalr";
import * as signalR from "@microsoft/signalr";
import {IAmperageMarks} from "../../Interfaces/IAmperageMarks";
import LastMeasureComponent from "../Components/LastMeasureComponent";
import DialogComponent from "../Components/DialogComponent";
import {TSubType} from "../../Types/Types";

export default function Amperage() {
    const hubConnection = useRef<HubConnection>(new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5000/measure")
        .configureLogging(signalR.LogLevel.Information)
        .build());

    // TODO собрать в 1 объект
    const [measureList, setMeasureList] = useState<{ waveLength: number, amperage: number }[]>([]);
    const [amperageMarks, setAmperageMarks] = useState<IAmperageSlider>({marks: [], value: 0, maxMave: 0});
    const [rangeWave, setRangeWave] = useState<number>(0);
    const [startWave, setStartWave] = useState<number>(0);
    const [isMeasure, setIsMeasure] = useState<string>("false");
    const [open, setOpen] = React.useState(false);
    const [alignment, setAlignment] = React.useState<TSubType>('range');

    useEffect(() => {
        hubConnection.current.start().then(a => {
            console.log(a)
        });

        return () => {
            // TODO отправить команду стоп
            hubConnection.current.stop();
        };
    }, []);

    const action = (message: string) => {
        const valueList = message.split("-");
        if(valueList[1] === "STOP"){
            setIsMeasure("false");
            setOpen(true)
            return;
        }
        const waveLength = Number(valueList[1]);
        const amperage = Number(valueList[2]);

        setMeasureList(oldValue => {
            return [{waveLength, amperage}, ...oldValue]
        });

        const newValue = ({marks: [...amperageMarks.marks], value: ((waveLength - startWave) * 100 / rangeWave), maxMave: amperageMarks.maxMave});
        setAmperageMarks(newValue);
    };

    useEffect(() => {
        if (hubConnection?.current !== null) {
            if (isMeasure === "false") {
                hubConnection.current.off("AMP");
                return;
            }
            hubConnection.current.on("AMP", action);
        }
    }, [isMeasure]);

    const startMeasureAction = (startMeasure: IStartMeasureData) => {
        setMeasureList([])
        const sub = startMeasure.endPosition - startMeasure.startPosition;
        setRangeWave(sub);
        setStartWave(startMeasure.startPosition)
        const newMarks: IAmperageMarks[] = [
            {value: 0, label: startMeasure.startPosition.toString()},
            ...[10, 20, 30, 40, 50, 60, 70, 80, 90].map((value: number, index: number) => {
                return {value: value, label: (startMeasure.startPosition + ((sub / 10) * (index + 1))).toFixed(0).toString()}
            }),
            {value: 100, label: startMeasure.endPosition.toString()}]
        setAmperageMarks({marks: [...newMarks], value: 0, maxMave: startMeasure.endPosition})

        setIsMeasure("true")
    }

    return (
        <div>
            <div className="amperage-container">
                <div className="amperage-container-left">
                    <div className="amperage-container-left-action">
                        <ToggleButtonGroup
                            color="primary"

                            value={alignment}
                            exclusive
                            onChange={(event: any, newAlignment: TSubType) => {
                                setAlignment(newAlignment);
                            }}
                        >
                            <ToggleButton value="range">Длина волны/ток</ToggleButton>
                            <ToggleButton value="time">Время/ток</ToggleButton>
                        </ToggleButtonGroup>
                        <Actions startMeasure={startMeasureAction} type={"amp"} subType={alignment} />
                    </div>
                    <LastMeasureComponent measure={measureList} leftName={alignment === "time" ? "t, сек" : "h, Нм"} rightName={"I, Ам"}/>
                </div>

                <div className="amperage-loader">
                    <div style={{width: "350px"}}>
                        <Slider
                            aria-label="Custom marks"
                            value={amperageMarks.value}
                            disabled={true}
                            getAriaValueText={(value: any) => {
                                return `${value * amperageMarks.maxMave / 100}, нм`
                            }}
                            valueLabelDisplay="off"
                            getAriaLabel={(value: any) => {
                                return `${value * amperageMarks.maxMave / 100}, нм`
                            }}
                            marks={amperageMarks.marks}
                        />
                    </div>
                    <div style={{marginTop: "40px", display: "flex", justifyContent: "center"}}>
                        <ChartComponent
                            measure={measureList.map(value => ({xValue: value.waveLength, yValue: value.amperage}))}
                            xFormatter={(seriesName: number) => `Длина волны: ${seriesName}, нм`}
                            yFormatter={(val: number, opts?: any) => `${val}, Ам`}
                            yTitleFormatter={value => "Ток:"}
                        />
                    </div>
                </div>
            </div>
           <DialogComponent
               onClickAction={() => setOpen(false)}
               onCloseAction={() => setOpen(false)}
               openState={open}/>
        </div>
    );
}
