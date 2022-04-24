import React, { useEffect, useRef, useState } from "react";
import './Style/amperage.scss'
import { HubConnection } from "@microsoft/signalr";
import * as signalR from "@microsoft/signalr";
import DialogComponent from "../Components/DialogComponent";
import { IAmperageState, IMeasureElemMqttResponse, MeasureStatusEnum } from "./Interfaces/AmperagePageInterfaces";
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
        hubConnection.current.start().then(a => {
            console.log(a)
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

    const continueMeasureAction = (prev: IAmperageState, message: IMeasureElemMqttResponse): IAmperageState => {
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
        result.measureList = [{ x: message.x, y: message.y }, ...prev.measureList];

        if (stateAmperage.alignment === "range") {
            result.measureList = [{ x: (message.x / 100), y: message.y }, ...prev.measureList];
            result.amperageMarks.value = ((message.x - prev.startWave) * 100 / prev.rangeWave);

            localStorage.setItem(measureRangeInLocalStorageName, JSON.stringify(result));
            return result;
        }

        if (stateAmperage.alignment === "time") {
            result.measureList = [{ x: message.x, y: message.y }, ...prev.measureList];
            result.amperageMarks.value = (message.x * 100 / prev.rangeWave);
            localStorage.setItem(measureTimeInLocalStorageName, JSON.stringify(result))
            return result;
        }

        return result;
    }

    const action = (message: IMeasureElemMqttResponse) => {
        setStateAmperage(prev => {
            if (message.isStop) {
                endMeasureAction(prev, message)
                return { ...prev, open: true };
            }

            return continueMeasureAction(prev, message);
        })
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
                        {stateAmperage.measureAdditionInfo.frequency === 0
                            ? <></>
                            : <AmperageTime
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
