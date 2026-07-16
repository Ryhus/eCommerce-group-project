import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

export function requestIdMiddleware(request: Request & { id?: string }, response: Response, next: NextFunction) {
  request.id = request.header("x-request-id") ?? randomUUID();
  response.setHeader("x-request-id", request.id);
  next();
}
