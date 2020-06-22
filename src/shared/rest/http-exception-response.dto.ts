export class HttpExceptionResponse {

    statusCode: number;
    message: string;
    error?: string;
    timestamp: string;
    path: string;
    method: string;
}