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
import "./Style/history.scss";
import {
    CircularProgress,
    FormControl, IconButton,
    Input,
    InputAdornment,
    InputLabel,
    Link,
    Pagination, Tooltip,
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

const onePageCountOfElem: number = Math.floor((window.innerHeight - 177 - 60) / 60);

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

        errorLoadResult("?????????????????? ?????????????????????? ????????????");
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
        <div className="history" style={{display: "flex", flexDirection: "column"}}>
            <div className="history-pagination">
                <div className="history-search">
                    <div className="history-pagination-title">
                        ?????????? ???? ?????????????? ??????????????????:
                    </div>
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">????????????????, ????????, ????????????????</InputLabel>
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
            <TableContainer component={Paper}>
                <Table aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="left" style={{minWidth: 240}}>???????????????? ??????????????????</StyledTableCell>
                            <StyledTableCell align="left" style={{minWidth: 240}}>?????? ??????????????????</StyledTableCell>
                            <StyledTableCell align="left" style={{minWidth: 240}}>???????? ??????????????????</StyledTableCell>
                            <StyledTableCell align="left" style={{minWidth: 240}}>???????????????? ??????????????????</StyledTableCell>
                            <StyledTableCell align="left" style={{minWidth: 240}}>???????????????????? ????????????</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                            { !isLoad ? <>
                                {(historyState.wasFirstLoad && historyState.history.length === 0)
                                    ? ""
                                    : historyState.history.map((historyItem) => (
                                    <StyledTableRow key={historyItem.creationDateTime}>
                                        <StyledTableCell  align="left" >
                                            {historyItem.measureName}
                                        </StyledTableCell>
                                        <StyledTableCell  align="left" style={{whiteSpace: "pre-line"}}>
                                            {historyItem.measureType}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{moment(historyItem.creationDateTime).format("DD.MM.yyyy HH:mm")}</StyledTableCell>
                                        <StyledTableCell  align="left">
                                            <Tooltip title={historyItem.description}>
                                                <IconButton>
                                                    <svg style={{cursor:"pointer"}} xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                                                </IconButton>
                                            </Tooltip>
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            <Link href="#" onClick={() => HttpServiceHelper.downloadAsFile(historyItem.id, historyItem.measureName || historyItem.creationDateTime)}>
                                                ??????????????
                                            </Link>
                                        </StyledTableCell>
                                    </StyledTableRow>

                                ))}
                            </> :  ""}
                    </TableBody>
                </Table>
            </TableContainer>
            { !isLoad ? <> {(historyState.wasFirstLoad && historyState.history.length === 0)
                ? <div className="load-history">?????????????? ????????????!</div>
                : ""}</> :  <div className="load-history"><CircularProgress/></div>}
        </div>
    )
}
