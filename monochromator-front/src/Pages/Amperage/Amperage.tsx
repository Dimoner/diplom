import React, { useEffect, useRef, useState } from "react";
import './Style/amperage.scss'
import { HubConnection } from "@microsoft/signalr";
import * as signalR from "@microsoft/signalr";
import DialogComponent from "../Components/DialogComponent";
import { IAmperageState, IMeasureElemMqttResponse, IMeasureFullMqttResponse, MeasureStatusEnum } from "./Interfaces/AmperagePageInterfaces";
import AmperageActionBlock from "./Components/AmperageActionBlock";
import { MeasureStateManager } from "../../StateManager/MeasureStateMaanger";
import AmperageRange from "./MeasureTypeComponent/AmperageRange";
import AmperageTime from "./MeasureTypeComponent/AmperageTime";
import { TSubType } from "../../Types/Types";
import { useDispatch } from "react-redux";
import { incrementDima } from "../../counterSlice";

export const measureRangeInLocalStorageName: string = "measure-range";
export const measureTimeInLocalStorageName: string = "measure-time";

const defaultValue: IAmperageState = {
    measureList: [],
    amperageMarks: { marks: [], value: 0, maxValue: 0 },
    rangeWave: 0,
    startWave: 0,
    measureId: "0",
    open: false,
    alignment: (localStorage.getItem("amperage-alignment") as TSubType) || 'range',
    measureAdditionInfo: {
        status: MeasureStatusEnum.None,
        measureDate: "",
        measureId: 0,
        measureName: "",
        frequency: 0
    },
    managerMeasure: {
        isPause: false,
        isWork: false
    }
};

let intervalOrReconnection: number;

export default function Amperage() {
    const hubConnection = useRef<HubConnection>(new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5000/measure")
        .configureLogging(signalR.LogLevel.Information)
        .build());
        
    const dispatch = useDispatch()
    const getDefaultValue = (): IAmperageState => {
        return defaultValue;
    }

    const [stateAmperage, setStateAmperage] = useState<IAmperageState>(getDefaultValue());

    const [dima, setDima] = useState<string>("");

    const [isRange, setIsRange] = useState<boolean>(false);

    useEffect(() => {
        connectAction()

        hubConnection.current.onclose(a => {
            // @ts-ignore
            intervalOrReconnection = setInterval(() => {
                connectAction()
            }, 1000)
        });

        return () => {
            hubConnection.current.stop();
        };
    }, []);

    useEffect(() => {
        localStorage.setItem("amperage-alignment", stateAmperage.alignment)

        const existHistory: string | null = localStorage.getItem(stateAmperage.alignment === "range"
            ? measureRangeInLocalStorageName
            : measureTimeInLocalStorageName)

        if (existHistory !== undefined && existHistory !== "" && existHistory !== null) {
            const parseHistory: IAmperageState = JSON.parse(existHistory)
            setStateAmperage(prev => parseHistory)
        }
        else {
            setStateAmperage({ ...defaultValue, alignment: stateAmperage.alignment })
        }

        setIsRange(stateAmperage.alignment === "range");
    }, [stateAmperage.alignment]);

    const endMeasureAction = (prev: IAmperageState, message: IMeasureElemMqttResponse) => {
        hubConnection.current.off(message.id.toString());
        MeasureStateManager.IsMeasure = false;
        window.onbeforeunload = () => undefined
        prev.measureAdditionInfo = {
            ...prev.measureAdditionInfo,
            status: MeasureStatusEnum.End,
            measureId: message.id,
        }
        prev.measureId = "0"

        prev.managerMeasure = {
            isPause: false,
            isWork: false
        }

        localStorage.setItem(stateAmperage.alignment === "range"
            ? measureRangeInLocalStorageName
            : measureTimeInLocalStorageName, JSON.stringify(prev))
        dispatch(incrementDima());
    }

    const continueMeasureAction = (prev: IAmperageState, message: IMeasureElemMqttResponse[]): IAmperageState => {
        MeasureStateManager.IsMeasure = true;
        dispatch(incrementDima());
        const result = {
            ...prev,
            amperageMarks: {
                ...prev.amperageMarks,
                marks: [...prev.amperageMarks.marks],
                maxValue: prev.amperageMarks.maxValue
            },
            measureAdditionInfo: {
                ...prev.measureAdditionInfo,
                status: MeasureStatusEnum.Measuring,
            }
        }

        if (stateAmperage.alignment === "range") {
            result.measureList = [...message.map(valeu => {
                return { x: (valeu.x / 100), y: valeu.y }
            }), ...prev.measureList];

            result.amperageMarks.value = (((message[message.length - 1].x / 100) - prev.startWave) * 100 / prev.rangeWave);

            localStorage.setItem(measureRangeInLocalStorageName, JSON.stringify(result));
            return result;
        }

        if (stateAmperage.alignment === "time") {

            message = message.map(value => {
                value.x = value.x + 1;
                return value;
            })

            result.measureList = [...message.map(value => {
                return { x: value.x, y: value.y };
            }), ...prev.measureList];

            result.amperageMarks.value = (message[message.length - 1].x * 100 / prev.rangeWave);
            localStorage.setItem(measureTimeInLocalStorageName, JSON.stringify(result))
            return result;
        }

        return result;
    }

    const action = (message: IMeasureFullMqttResponse) => {
        const isStopValue = message.dataList.find(value => value.isStop);
        if (isStopValue === undefined) {
            setStateAmperage(prev => {
                return continueMeasureAction(prev, message.dataList);
            })
        } else {
            const withoutStop = message.dataList.filter(data => !data.isStop)
            setStateAmperage(prev => {
                return continueMeasureAction(prev, withoutStop);
            })

            setStateAmperage(prev => {
                endMeasureAction(prev, isStopValue)
                return { ...prev, open: true };
            })
        }

        setDima(Math.random().toString())
    };

    useEffect(() => {
        if (hubConnection?.current !== null && hubConnection?.current !== undefined && stateAmperage.measureId !== "0") {
            hubConnection.current.on(stateAmperage.measureId, action);
            window.onbeforeunload = function () {
                return "Измерение еще не завершено, вы уверены, что хотите закрыть приложение?";
            };
        }
    }, [stateAmperage.measureId]);

    const connectAction = () => {
        hubConnection.current.start().then(a => {
            console.log(a)
            window.clearInterval(intervalOrReconnection);
            if (stateAmperage.measureId !== "" && stateAmperage.measureId !== undefined && stateAmperage.measureId !== null) {
                hubConnection.current.on(stateAmperage.measureId, action);
            }
        });
    }

    return (
        <div style={{ width: "90%", marginLeft: "-5px" }}>
            <div className="amperage-container">
                <AmperageActionBlock
                    alignment={stateAmperage.alignment}
                    setStateAmperage={setStateAmperage}
                />
            </div>
            {
                isRange
                    ? <AmperageRange
                        measureList={stateAmperage.measureList}
                        measureAdditionInfo={stateAmperage.measureAdditionInfo}
                        amperageMarks={stateAmperage.amperageMarks}
                        managerMeasure={stateAmperage.managerMeasure}
                        setStateAmperage={setStateAmperage}
                    />
                    : <>
                        {<AmperageTime
                            measureList={stateAmperage.measureList}
                            amperageMarks={stateAmperage.amperageMarks}
                            measureAdditionInfo={stateAmperage.measureAdditionInfo}
                            managerMeasure={stateAmperage.managerMeasure}
                            setStateAmperage={setStateAmperage}
                        />
                        }</>
            }
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
                openState={stateAmperage.open} />
        </div>
    );
}
