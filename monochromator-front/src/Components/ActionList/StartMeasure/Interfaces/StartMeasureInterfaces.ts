import { IBaseControlItem } from "../../../Base/ControlItem";

export interface IStartMeasureState{
    currentPosition: number,
    startPosition: number,
    description: string,
    measureName: string
    // для измерения на отрезке
    rangeState: IRangeMeasureFormComponentField,
    // для измерения в точке от времени
    timeState: ITimeMeasureFormComponentField
}

// для измерения на отрезке
export interface IRangeMeasureFormComponentField {
    endPosition: number,
    step: number,
    count: number,
    // скорость вращения в тиках
    speed: number
}

// для измерения в точке от времени
export interface ITimeMeasureFormComponentField {
    delay: number,
    num: number,
    frequency: number
}

//  ответ + запрос на начало измерения
export interface IStartMeasureResponse extends IStartMeasureRequest {
    measureId: number
}

// запрос для измерения
export interface IStartMeasureRequest {
    currentPosition: number,
    startPosition: number,
    description: string,
    measureName: string,
    // 3 - ток/4 - счет
    actionType: 3 | 4,
    endPosition?: number,
    step?: number,
    count?: number,
    delay?: number,
    num?: number,
    frequency?: number,
    // скорость вращения в тиках
    speed: number
}
