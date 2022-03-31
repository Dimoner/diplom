import {IAmperageSlider} from "../../../Interfaces/IAmperageSlider";
import {TSubType} from "../../../Types/Types";

export interface IAmperageState {
    measureList: IMeasureItem[],
    amperageMarks: IAmperageSlider,
    rangeWave: number,
    startWave: number,
    isMeasure: string,
    open: boolean,
    alignment: TSubType
}

export interface IMeasureItem {
    waveLength: number,
    amperage: number
}
