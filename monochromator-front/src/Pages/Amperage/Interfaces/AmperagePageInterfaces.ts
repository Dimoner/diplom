import { TSubType } from "../../../Types/Types";
import { IAmperageSlider } from "./IAmperageSlider";

export interface IAmperageState {
    measureList: IMeasureItem[],
    amperageMarks: IAmperageSlider,
    rangeWave: number,
    startWave: number,
    // идентификатор счета (число в виде строки)
    measureId: string,
    open: boolean,
    // режимы измерений
    alignment: TSubType
}

export interface IMeasureItem {
    // значение по oX
    x: number,

    // значение по oY
    y: number
}

// элемент 1 измерения через mqtt
export interface IMeasureElemMqttResponse {
    // измерение по oX
    x: number,

    // измерение по oY
    y: number,

    // айди операции измерения
    id: number,

    // Конец ли это измерения
    isStop: boolean
}
