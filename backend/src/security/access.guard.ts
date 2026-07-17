import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { AppRequest } from "../common/http.types.js";
import { COOKIE_NAMES } from "./cookie.constants.js";
import { TokenService } from "./token.service.js";

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private readonly tokens: TokenService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AppRequest>();
    const token = request.cookies?.[COOKIE_NAMES.access] as string | undefined;
    if (!token) throw new UnauthorizedException("Authentication required");
    try {
      request.user = await this.tokens.verifyAccess(token);
      return true;
    } catch {
      throw new UnauthorizedException("Access token is invalid or expired");
    }
  }
}

@Injectable()
export class OptionalAccessGuard implements CanActivate {
  constructor(private readonly tokens: TokenService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AppRequest>();
    const token = request.cookies?.[COOKIE_NAMES.access] as string | undefined;
    if (!token) return true;
    try {
      request.user = await this.tokens.verifyAccess(token);
      return true;
    } catch {
      throw new UnauthorizedException("Access token is invalid or expired");
    }
  }
}
