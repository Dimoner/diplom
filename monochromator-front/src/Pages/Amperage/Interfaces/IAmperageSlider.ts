//
export interface IAmperageSlider {
    marks: IAmperageMarks[],
    value: number,
    maxValue: number
}

export interface IAmperageMarks {
    value: number,
    label: string
}

