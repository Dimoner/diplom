import React, {Dispatch, SetStateAction} from "react";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import {IAmperageState, IManagerMeasure} from "../Interfaces/AmperagePageInterfaces";

export interface IMeasureButtonActionComponent {
    managerMeasure: IManagerMeasure,
    setStateAmperage: Dispatch<SetStateAction<IAmperageState>>
}

export default function MeasureButtonActionComponent({managerMeasure, setStateAmperage}: IMeasureButtonActionComponent) {
    const action = (actionType: "start" | "pause" | "stop") => {
        setStateAmperage(prev => {
            if (actionType === "pause") {
                fetch(`http://localhost:5000/control-measure/${actionType}`).then()
                prev.managerMeasure.isPause = true
            }

            if (actionType === "start") {
                fetch(`http://localhost:5000/control-measure/${actionType}`).then()
                prev.managerMeasure.isPause = false
            }

            return {
                ...prev,
                managerMeasure: {
                    ...prev.managerMeasure,
                }
            }
        })

        if (actionType === "stop") {
            setOpen(1)
        }
    }

    const [open, setOpen] = React.useState<number>(-1);
    const [awaitResponse, setAwaitResponse] = React.useState<boolean>(false);

    const handleClose = (isCancel: boolean) => {
        if (isCancel) {
            setOpen(-1)
            return;
        }

        setAwaitResponse(true)
        fetch(`http://localhost:5000/control-measure/stop`).then(() => {
            setOpen(-1)
            setStateAmperage(prev => {
                prev.managerMeasure.isPause = false
                prev.managerMeasure.isWork = false

                return {
                    ...prev,
                    managerMeasure: {
                        ...prev.managerMeasure,
                    }
                }
            })
        }).finally(() => {
            setAwaitResponse(false)
        })
    };
    return (
        <div className="control-measure">
            <div className={!managerMeasure?.isWork ? "control-measure-title-disable" : "control-measure-title"}>
                Управление измерением
            </div>
            <div className="control-measure-buttons">
                <Button
                    disabled={!(managerMeasure?.isWork && managerMeasure?.isPause)}
                    variant="contained"
                    onClick={() => action("start")}
                    color="success">
                    Продолжить
                </Button>
                <Button
                    disabled={!(managerMeasure?.isWork && !managerMeasure?.isPause)}
                    variant="contained"
                    onClick={() => action("pause")}
                >
                    Пауза
                </Button>
                <Button
                    disabled={!managerMeasure?.isWork}
                    onClick={() => action("stop")}
                    variant="contained"
                    color="error">
                    Закончить
                </Button>
            </div>
            <Dialog
                open={open !== -1}
                onClose={() => handleClose(true)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Уведомление!
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Вы уверены, что хотите сбросить состояние устрйоства?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{height: "70px"}} onClick={() => handleClose(true)}>Отменить</Button>
                    <Button style={{height: "70px", marginRight: "20px"}} onClick={() => handleClose(false)} autoFocus>
                        {awaitResponse ? <CircularProgress style={{marginRight: "20px"}}/> : "Сбросить"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
