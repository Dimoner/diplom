import React, {ChangeEvent, useEffect, useState} from "react";
import {
    IFileHistoryFullResponse,
    IGetFileHistoryFilterRequest, IHistoryItem,
    IHistoryPageState
} from "./Interfaces/HistoryInterfaces";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "./Style/history.style.scss";
import {
    CircularProgress,
    FormControl,
    Input,
    InputAdornment,
    InputLabel,
    Link,
    Pagination,
} from "@mui/material";
import { HttpServiceHelper, IErrorResponse } from "../../Helpers/HttpServiceHelper";
import moment from "moment";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.info.light,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const onePageCountOfElem: number = 15;

export default function History(){
    const [cacheHistory, setCacheHistory] = useState<{[key in string]: IHistoryPageState}>({})
    const [historyState, setHistoryState] = useState<IHistoryPageState>({
        currentPage: 0,
        total: 0,
        history: [],
        pageCount: 0,
        wasFirstLoad: true
    });

    const [isLoad, setLoad] = React.useState(false);
    const [loadResultText, setLoadResultText] = React.useState("");
    const [loadResultTextStatus, setLoadResultTextStatus] = React.useState(false);

    const startLoad = () => {
        setLoad(true);
        setLoadResultText("");
        setLoadResultTextStatus(false);
    }

    const endLoad = () => {
        setLoad(false);
        setLoadResultText("");
        setLoadResultTextStatus(false);
    }

    const errorLoadResult = (text: string) => {
        setLoad(false);
        setLoadResultText(text)
        setLoadResultTextStatus(false);
    }

    const getMeasure = async (pageCount: number, searchText: string = "", deleteCache = false) => {
        if (cacheHistory[pageCount] !== undefined && !deleteCache){
            setHistoryState(cacheHistory[pageCount]);
            return;
        }
        startLoad();

        const request: IGetFileHistoryFilterRequest = {
            startRow: onePageCountOfElem * pageCount - onePageCountOfElem,
            endRow: onePageCountOfElem * pageCount,
            name: searchText.trim()
        }
        let response = await fetch('http://localhost:5000/history/get',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            });

        if (response.status == 400) {
            const result: IErrorResponse = await response.json()
            errorLoadResult(result.errorText);
            return;
        }

        if (response.ok) {
            const result: IFileHistoryFullResponse = await response.json()
            const pageAllCount: number = Math.ceil(result.total / onePageCountOfElem);

            const newValue = {
                total: result.total,
                history: result.history,
                currentPage: pageCount,
                pageCount: pageAllCount,
                wasFirstLoad: true
            };
            setHistoryState(newValue);
            if(!deleteCache) {
                setCacheHistory(prev => {
                    return {
                        ...prev,
                        [pageCount]: newValue
                    }
                })
            }else {
                setCacheHistory({ [pageCount]: newValue})
            }

            endLoad()
            return;
        }

        errorLoadResult("Произошла неизвестная ошибка");
    }

    useEffect(() => {
        getMeasure(1).then(r => r);
    }, [])

    const debounce = (func: any, wait: any, immediate: any) => {
        let timeout: any;

        return function executedFunction(value: any) {
            // @ts-ignore
            const context = this;
            const args = arguments;

            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };

            const callNow = immediate && !timeout;

            clearTimeout(timeout);

            timeout = setTimeout(later, wait);

            if (callNow) func.apply(context, args);
        };
    }

    const changeSearch = () => debounce((event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        getMeasure(1, event.target.value, true).then(r => {

        })

        setHistoryState(prev => {
            return {
                ...prev,
                pageCount: 0
            }
        })
    }, 600, false)

    return (
        <div className="history">
            <TableContainer component={Paper}>
                <div className="history-pagination">
                    <div className="history-search">
                        <div className="history-pagination-title">
                            Поиск по истории измерений:
                        </div>
                        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                            <InputLabel htmlFor="standard-adornment-amount">Название, дата, описание</InputLabel>
                            <Input
                                id="standard-adornment-amount"
                                onChange={changeSearch()}
                                startAdornment={<InputAdornment position="start">|</InputAdornment>}
                            />
                        </FormControl>
                    </div>
                    {historyState.pageCount !== 0
                        ? <Pagination onChange={(event, page) => getMeasure(page).then(r => r)} count={historyState.pageCount} color="primary"/>
                        : ""}
                </div>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Название измерение</StyledTableCell>
                            <StyledTableCell align="right">Дата измерения</StyledTableCell>
                            <StyledTableCell align="right">Описание измерения</StyledTableCell>
                            <StyledTableCell align="right"></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                            { !isLoad ? <>
                                {(historyState.wasFirstLoad && historyState.history.length === 0)
                                    ? <div className="load-history">История пустая!</div>
                                    : historyState.history.map((historyItem) => (
                                    <StyledTableRow key={historyItem.creationDateTime}>
                                        <StyledTableCell component="th" scope="row">
                                            {historyItem.measureName}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">{moment(historyItem.creationDateTime).format("DD.MM.yyyy HH:mm")}</StyledTableCell>
                                        <StyledTableCell style={{display: "flex"}} align="right">
                                            <div style={{whiteSpace: "pre-line", width: "50%", textAlign: "start"}}>
                                                {historyItem.description}
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <Link href="#" onClick={() => HttpServiceHelper.downloadAsFile(historyItem.id, historyItem.measureName || historyItem.creationDateTime)}>
                                                Скачать
                                            </Link>
                                        </StyledTableCell>
                                    </StyledTableRow>

                                ))}
                            </> :  <div className="load-history"><CircularProgress/></div>}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
