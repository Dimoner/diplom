import React from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tab, Tabs,
    Typography
} from "@mui/material";
import CheckState from "./ActionList/CheckState";
import StartMeasure from "./ActionList/StartMeasure/StartMeasure";
import ChangePosition from "./ActionList/ChangePosition";
import {TSubType, TType} from "../Types/Types";
import { IStartMeasureResponse } from "./ActionList/StartMeasure/Interfaces/StartMeasureInterfaces";
import { MeasureStateManager } from "../StateManager/MeasureStateMaanger";

function TabPanel(props: any) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export interface IActionsProps {
    startMeasure: (startMeasure: IStartMeasureResponse) => void,
    type: TType,
    subType: TSubType
}

export default function Actions(props: IActionsProps) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [value, setValue] = React.useState(0);

    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
    };

    const startMeasureAction = (startMeasure: IStartMeasureResponse) => {
        props.startMeasure(startMeasure);
        handleClose()
    }

    const a11yProps = (index: number) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    return (
        <div style={{ position: "absolute", right: 25, top: 21}}>
            <Button  variant="outlined" onClick={handleClickOpen} disabled={MeasureStateManager.IsMeasure}>
                Действия
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {props.subType === "range"
                        ? `Измерение в режиме (длина волны / ${props.type === "amp" ? "ток" : "счет"})`
                        : `Измерение в режиме (время / ${props.type === "amp" ? "ток" : "счет"})`
                    }
                </DialogTitle>
                <DialogContent aria-setsize={1000}>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="Состояния" {...a11yProps(0)} />
                                <Tab label="Положение" {...a11yProps(1)} />
                                <Tab label="Измерение" {...a11yProps(2)} />
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                            <CheckState/>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <ChangePosition/>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <StartMeasure startMeasure={startMeasureAction} type={props.type} subType={props.subType}/>
                        </TabPanel>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Выход</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
