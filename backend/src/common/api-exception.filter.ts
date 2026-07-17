import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import type { Request, Response } from "express";

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request & { id?: string }>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;
    const details = typeof exceptionResponse === "object" && exceptionResponse ? exceptionResponse : {};
    const rawMessage =
      typeof exceptionResponse === "string"
        ? exceptionResponse
        : "message" in details
          ? (details.message as string | string[])
          : "Internal server error";
    const messages = Array.isArray(rawMessage) ? rawMessage : [rawMessage];

    response.status(status).json({
      statusCode: status,
      code: "code" in details ? details.code : status === 500 ? "INTERNAL_ERROR" : "REQUEST_FAILED",
      message: messages[0],
      ...(messages.length > 1 ? { fieldErrors: messages } : {}),
      requestId: request.id,
    });
  }
}
