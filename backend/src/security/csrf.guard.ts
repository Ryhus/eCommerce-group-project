import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import type { Request } from "express";
import { COOKIE_NAMES } from "./cookie.constants.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    if (SAFE_METHODS.has(request.method)) return true;
    const cookieToken = request.cookies?.[COOKIE_NAMES.csrf] as string | undefined;
    const headerToken = request.header("x-csrf-token");
    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      throw new ForbiddenException({ code: "CSRF_INVALID", message: "CSRF token is missing or invalid" });
    }
    return true;
  }
}
