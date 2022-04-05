import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Divider, List, ListItem, ListItemText
} from "@mui/material";
import React, {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "./Style/component.style.scss";
import {MeasureStateManager} from "../StateManager/MeasureStateMaanger";
import {IAmperageState} from "../Pages/Amperage/Interfaces/AmperagePageInterfaces";
import "./Style/header.style.scss";
import { measureRangeInLocalStorageName, measureTimeInLocalStorageName } from "../Pages/Amperage/Amperage";

const pathNavigation: { label: string, key: string }[] = [
    {
        label: "Токовый режим",
        key: "Amperage"
    },
    {
        label: "Счетный режим",
        key: "Count"
    },
    {
        label: "История",
        key: "History"
    }
];

export default function Header() {
    const [value, setValue] = React.useState(-1);

    const navigate = useNavigate();
    const location = useLocation();

    const [open, setOpen] = React.useState<number>(-1);

    useEffect(() => {
        const navigateValue = pathNavigation.findIndex(key => location.pathname.toLowerCase().includes(key.key.toLowerCase()));
        if (navigateValue !== undefined) {
             setValue(navigateValue);
        }
    }, []);

    const relocateAction = (newValue: number) => {
        setValue(newValue);
        const navigateValue: string = pathNavigation[newValue].key.toLowerCase()
        navigate(navigateValue, {replace: true})
    }

    const handleChange = (newValue: number) => {
        if (MeasureStateManager.IsMeasure){
            setOpen(newValue);
            return;
        }
        relocateAction(newValue);
    };

    const clearMeasureInStorageId = (measureInLocalStorageName: string) => {
        const existHistory: string | null = localStorage.getItem(measureInLocalStorageName)
        if (existHistory !== undefined && existHistory !== "" && existHistory !== null){
            const parseHistory: IAmperageState = JSON.parse(existHistory)
            parseHistory.measureId = "0";
            localStorage.setItem(measureInLocalStorageName, JSON.stringify(parseHistory))
        }
    }

    const handleClose = (isCancel: boolean) => {
        if(isCancel){
            setOpen(-1)
            return;
        }

        fetch(`http://localhost:5000/control-measure/stop`).then()
        MeasureStateManager.IsMeasure = false;
        clearMeasureInStorageId(measureRangeInLocalStorageName);
        clearMeasureInStorageId(measureTimeInLocalStorageName);
        relocateAction(open)
        setOpen(-1)
    };

    return (
        <div className="header-main">
            <Box
                role="presentation"
            >
                <DialogTitle id="alert-dialog-title">
                    Режимы:
                </DialogTitle>
                <Divider />
                <List>
                    {pathNavigation.map((item, index) =>{
                        return (
                            <ListItem
                                button key={item.key}
                                style={index === value ? {background:" rgba(25, 118, 210, 0.12)", borderRadius: "8px"}: {}}
                                onClick={() => handleChange(index)}>
                                <ListItemText primary={item.label} />
                            </ListItem>
                        )
                    })}
                </List>
            </Box>
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
                        В данный момент идет измерение, вы уверены, что хотите его прервать?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(true)}>Отменить переход</Button>
                    <Button onClick={() => handleClose(false)} autoFocus>
                        Прервать измерение
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
