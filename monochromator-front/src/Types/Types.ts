// типы видов измерений
// 3 - ток
// 4 - счет
export type TType = "amp" | "count";

// режимы измерений
export type TSubType = "time" | "range";
export const SubTypeList: {key: TSubType, label: string}[] = [
    {
        key: "range",
        label: "Диапозон длин волн"
    },
    {
        key: "time",
        label: "Одна точка от времени"
    },
]
