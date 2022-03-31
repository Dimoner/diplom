export interface IHistoryItem {
    id: number,
    creationDateTime: string,
    description: string,
    measureName: string
}


export interface IFileHistoryFullResponse {
    total: number,
    history: IHistoryItem[]
}

export interface IGetFileHistoryFilterRequest {
    startRow: number,
    endRow: number,
    name?: string
}

export interface IHistoryPageState {
    total: number,
    history: IHistoryItem[],
    currentPage: number,
    pageCount: number,
    wasFirstLoad: boolean
}
