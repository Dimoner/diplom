// ошибка от сервера с текстом
export interface IErrorResponse{
    errorText: string,
    errorControllerList: {[key in string]: string[]}
}

export interface IHttpResponseModel<TResponse> {
    status: number,
    body: TResponse | undefined,
    errorBody: IErrorResponse | undefined
}

export class HttpServiceHelper {
    public static async SendPostRequest<TBody, TResponse>(url: string, body?: TBody): Promise<IHttpResponseModel<TResponse>>{
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: ""
        };
        if (body !== undefined){
            options.body = JSON.stringify(body)
        }
        const response = await fetch(url, options);

        const responseBody: IErrorResponse | TResponse = await response.json()

        if (response.status.toString().startsWith("4") || response.status.toString().startsWith("5")) {
            return {
                status: response.status,
                body: undefined,
                errorBody: responseBody as IErrorResponse
            };
        }

        return {
            status: response.status,
            body: responseBody as TResponse,
            errorBody: undefined
        };
    }
}