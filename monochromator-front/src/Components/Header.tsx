import {Box, Tab, Tabs} from "@mui/material";
import React, {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "./Style/component.style.scss";

const pathNavigation: { label: string }[] = [
    {
        label: "Amperage",
    },
    {
        label: "Count",
    },
    {
        label: "History",
    }
];

export default function Header() {
    const [value, setValue] = React.useState(0);

    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
        const navigateValue: string = pathNavigation[newValue].label.toLowerCase()
        navigate(navigateValue, {replace: true})
    };

    useEffect(() => {
        const navigateValue = pathNavigation.findIndex(key => location.pathname.toLowerCase().includes(key.label.toLowerCase()));
        if (navigateValue !== undefined) {
             setValue(navigateValue);
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
                    {pathNavigation.map((item, index) =>{
                        return <Tab key={item.label} label={item.label} {...a11yProps(index)} />
                    })}
                </Tabs>
            </Box>
        </div>
    );
}
