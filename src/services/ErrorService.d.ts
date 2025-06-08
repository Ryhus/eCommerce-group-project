export interface ErrorResponse {
    statusCode: number;
    message: string;
    errors: {
        code: string;
        message: string;
    }[];
}
export declare function serverErrorHandler(error: unknown): void;
