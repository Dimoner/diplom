import React, { Dispatch, SetStateAction } from "react";
import { Box, DialogTitle, Tab, Tabs } from "@mui/material";
import { SubTypeList, TSubType } from "../../../Types/Types";
import Actions from "../../../Components/Actions";
import { IAmperageState, MeasureStatusEnum } from "../Interfaces/AmperagePageInterfaces";
import { IStartMeasureResponse } from "../../../Components/ActionList/StartMeasure/Interfaces/StartMeasureInterfaces";
import { measureRangeInLocalStorageName, measureTimeInLocalStorageName } from "../Amperage";
import { IAmperageMarks } from "../Interfaces/IAmperageSlider";
import { MeasureStateManager } from "../../../StateManager/MeasureStateMaanger";
import moment from "moment";

export interface IAmperageActionBlock {
    alignment: TSubType,
    setStateAmperage: Dispatch<SetStateAction<IAmperageState>>
}

const a11yProps = (index: number) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function AmperageActionBlock({ alignment, setStateAmperage }: IAmperageActionBlock) {
    const getNewMarks = (xStart: number, xEnd: number) => {
        return [
            { value: 0, label: xStart.toString() },
            ...[10, 20, 30, 40, 50, 60, 70, 80, 90].map((value: number, index: number) => {
                const label = (xStart + (((xEnd - xStart) / 10) * (index + 1))).toFixed(0).toString()
                return {
                    value: value,
                    label: label
                }
            }),
            { value: 100, label: xEnd.toString() }
            ];
    }

    const startMeasureAction = (startMeasure: IStartMeasureResponse) => {
        if (alignment === "range" && startMeasure.endPosition !== undefined){
            localStorage.removeItem(measureRangeInLocalStorageName);
            const sub = startMeasure.endPosition - startMeasure.startPosition;

            const newMarks: IAmperageMarks[] = getNewMarks(startMeasure.startPosition, startMeasure.endPosition);
            setStateAmperage((prev: IAmperageState): IAmperageState => ({
                ...prev,
                measureList: [],
                amperageMarks: { marks: [...newMarks], value: 0, maxValue: (startMeasure.endPosition as number) },
                rangeWave: sub,
                startWave: startMeasure.startPosition,
                measureId: startMeasure.measureId.toString(),
                open: false,
                alignment: alignment,
                measureAdditionInfo: {
                    measureId: 0,
                    status: MeasureStatusEnum.Measuring,
                    measureName: startMeasure.measureName,
                    measureDate: moment().format("DD.MM.yyyy HH:mm")
                }
            }))
            return;
        }

        if (alignment === "time" && startMeasure.delay !== undefined){
            localStorage.removeItem(measureTimeInLocalStorageName);

            const newMarks: IAmperageMarks[] = getNewMarks(0, startMeasure.delay);
            setStateAmperage(prev => ({
                ...prev,
                measureList: [],
                amperageMarks: { marks: [...newMarks], value: 0, maxValue: (startMeasure.delay as number) },
                rangeWave: (startMeasure.delay as number),
                startWave: 0,
                measureId: startMeasure.measureId.toString(),
                open: false,
                alignment: alignment
            }))
            return;
        }
    }

    return (
        <div className="amperage-container-left">
            <div className="amperage-container-left-action">
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={alignment}
                        aria-label="basic tabs example"
                    >
                        <DialogTitle id="alert-dialog-title">
                            Типы измерения:
                        </DialogTitle>
                        {SubTypeList.map((item, index) => {
                            return <Tab
                                disabled={MeasureStateManager.IsMeasure}
                                key={item.key}
                                value={item.key}
                                label={item.label}
                                {...a11yProps(index)}
                                onClick={() => setStateAmperage(prev => {
                                    return {
                                        ...prev,
                                        alignment: item.key
                                    }
                                })}
                            />
                        })}
                    </Tabs>
                </Box>
                <Actions startMeasure={startMeasureAction} type={"amp"} subType={alignment}/>
            </div>
        </div>
    )
}
