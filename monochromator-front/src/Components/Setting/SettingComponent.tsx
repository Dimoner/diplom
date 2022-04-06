import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import "./Style/setting.scss"
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

export interface ISettingComponent {
    closeSetting: () => void
}

export default function SettingComponent({closeSetting}: ISettingComponent) {
    return (
        <div className="setting">
            <DialogTitle>Настройки математических преобразований</DialogTitle>
            <DialogContent>
                <Box
                    noValidate
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        m: 'auto',
                        width: 'fit-content',
                    }}
                >
                   Формулы конвертации
                   Ток: Название величины: а.е
                   Счет: Навание величины: a.е

                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeSetting}>Close</Button>
            </DialogActions>
        </div>
    )
}
