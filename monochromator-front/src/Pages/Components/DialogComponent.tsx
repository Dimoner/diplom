import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import React from "react";

export interface IDialogComponentProps {
    openState: boolean,
    onClickAction: () => void,
    onCloseAction: () => void
}

export default function DialogComponent({ onClickAction, onCloseAction, openState}: IDialogComponentProps){
    return (
        <Dialog
            open={openState}
            onClose={onCloseAction}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle style={{color: "green"}} id="alert-dialog-title">
                {"Измерение заершилось успешно"}
            </DialogTitle>
            <DialogActions>
                <Button onClick={onClickAction} autoFocus>
                    Принять
                </Button>
            </DialogActions>
        </Dialog>
    )
}
