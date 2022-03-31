import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Typography
} from "@mui/material";
import React from "react";

export interface ILastMeasureComponent {
    measure: { waveLength: number, amperage: number }[],
    leftName: string,
    rightName: string
}

export default function LastMeasureComponent(props: ILastMeasureComponent) {
    return (
        <Box sx={{width: "100%"}}>
            <Paper sx={{width: "100%", mb: 1}}>
                <Toolbar
                    sx={{
                        pl: {sm: 1},
                        pr: {xs: 1, sm: 1}
                    }}
                >
                    <Typography
                        sx={{flex: "1 1 100%"}}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        Последние измерения
                    </Typography>
                </Toolbar>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">{props.leftName}</TableCell>
                                <TableCell align="right">{props.rightName}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.measure.filter((_, index) => index < 15).map((row) => (
                                <TableRow
                                    key={Math.random()}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell align="right">{row.waveLength}</TableCell>
                                    <TableCell align="right">{row.amperage}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    )
}
