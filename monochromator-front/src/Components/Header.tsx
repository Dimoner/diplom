import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tab,
    Tabs
} from "@mui/material";
import React, {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "./Style/component.style.scss";
import {MeasureStateManager} from "../StateManager/MeasureStateMaanger";
import {IAmperageState} from "../Pages/Amperage/Interfaces/AmperagePageInterfaces";
import {measureInLocalStorageName} from "../Pages/Amperage/Amperage";

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

const a11yProps = (index: number) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Header() {
    const [value, setValue] = React.useState(0);

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

    const handleChange = (event: any, newValue: number) => {
        if (MeasureStateManager.IsMeasure){
            setOpen(newValue);
            return;
        }
        relocateAction(newValue);
    };


    const handleClose = (isCancel: boolean) => {
        if(isCancel){
            setOpen(-1)
            return;
        }

        // TODO отправить команду STOP на сервер
        MeasureStateManager.IsMeasure = false;
        const existHistory: string | null = localStorage.getItem(measureInLocalStorageName)
        if (existHistory !== undefined && existHistory !== "" && existHistory !== null){
            const parseHistory: IAmperageState = JSON.parse(existHistory)
            parseHistory.measureId = "0";
            localStorage.setItem(measureInLocalStorageName, JSON.stringify(parseHistory))
        }
        relocateAction(open)
        setOpen(-1)
    };

    return (
        <div>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    {pathNavigation.map((item, index) =>{
                        return <Tab key={item.key} label={item.label} {...a11yProps(index)} />
                    })}
                </Tabs>
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
