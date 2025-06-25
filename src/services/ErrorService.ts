import axios from "axios";

export interface ErrorResponse {
  statusCode: number;
  message: string;
  errors: { code: string; message: string }[];
}

export function serverErrorHandler(error: unknown) {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    const errorResponse = error.response?.data;
    if (errorResponse) {
      const { statusCode, message } = errorResponse;
      throw { statusCode, message };
    }
  }
  throw error;
}
