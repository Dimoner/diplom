import {Box, Tab, Tabs} from "@mui/material";
import React, {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "./Style/component.style.scss";

const pathNavigation: { [key in string]: number } = {
    "amperage": 0,
    "count": 1,
    "history": 2
}

export default function Header() {
    const [value, setValue] = React.useState(0);

    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
        const navigateValue: string = Object.keys(pathNavigation).find(key => pathNavigation[key] === newValue) ?? ""
        navigate(navigateValue, {replace: true})
    };

    useEffect(() => {
        const navigateValue = Object.keys(pathNavigation).find(key => location.pathname.includes(key));
        if (navigateValue !== undefined) {
            setValue(pathNavigation[navigateValue]);
        }
    }, []);

    const a11yProps = (index: number) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    return (
        <div>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Amperage" {...a11yProps(pathNavigation.amperage)} />
                    <Tab label="Count" {...a11yProps(pathNavigation.count)} />
                </Tabs>
            </Box>
        </div>
    );
}
