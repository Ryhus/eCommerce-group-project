import { randomBytes } from "node:crypto";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { ApiCookieAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import type { AppRequest } from "../common/http.types.js";
import { AccessGuard } from "../security/access.guard.js";
import { COOKIE_NAMES } from "../security/cookie.constants.js";
import { CookieService } from "../security/cookie.service.js";
import { TokenService } from "../security/token.service.js";
import { toUserDto } from "../users/user.mapper.js";
import { UserDto } from "../users/dto/user.dto.js";
import { UsersService } from "../users/users.service.js";
import { AuthService } from "./auth.service.js";
import { LoginDto, RegisterDto } from "./dto/auth.dto.js";
import { AuthResponseDto, CsrfDto } from "./dto/auth-response.dto.js";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
    private readonly tokens: TokenService,
    private readonly cookies: CookieService
  ) {}

  @Get("csrf")
  @ApiOkResponse({ type: CsrfDto })
  csrf(@Res({ passthrough: true }) response: Response) {
    const csrfToken = randomBytes(32).toString("base64url");
    this.cookies.setCsrf(response, csrfToken);
    return { csrfToken };
  }

  @Post("register")
  @ApiCreatedResponse({ type: AuthResponseDto })
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async register(
    @Req() request: AppRequest,
    @Res({ passthrough: true }) response: Response,
    @Body() body: RegisterDto
  ) {
    const result = await this.auth.register(body, this.anonymousKey(request), this.metadata(request));
    this.cookies.setAuth(
      response,
      result.tokens.accessToken,
      result.tokens.refreshToken,
      result.tokens.refreshExpiresAt
    );
    this.cookies.clearAnonymousCart(response);
    return { user: result.user, cart: result.cart };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AuthResponseDto })
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async login(@Req() request: AppRequest, @Res({ passthrough: true }) response: Response, @Body() body: LoginDto) {
    const result = await this.auth.login(body, this.anonymousKey(request), this.metadata(request));
    this.cookies.setAuth(
      response,
      result.tokens.accessToken,
      result.tokens.refreshToken,
      result.tokens.refreshExpiresAt
    );
    this.cookies.clearAnonymousCart(response);
    return { user: result.user, cart: result.cart };
  }

  @Post("refresh")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  async refresh(@Req() request: AppRequest, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies?.[COOKIE_NAMES.refresh] as string | undefined;
    if (!refreshToken) return this.noRefreshToken();
    const result = await this.tokens.rotate(refreshToken, this.metadata(request));
    this.cookies.setAuth(
      response,
      result.tokens.accessToken,
      result.tokens.refreshToken,
      result.tokens.refreshExpiresAt
    );
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async logout(@Req() request: AppRequest, @Res({ passthrough: true }) response: Response) {
    await this.tokens.revoke(request.cookies?.[COOKIE_NAMES.refresh] as string | undefined);
    this.cookies.clearAuth(response);
    this.cookies.clearAnonymousCart(response);
  }

  @Get("me")
  @UseGuards(AccessGuard)
  @ApiCookieAuth()
  @ApiOkResponse({ type: UserDto })
  async me(@Req() request: AppRequest) {
    return toUserDto(await this.users.getEntity(request.user!.id));
  }

  private anonymousKey(request: AppRequest) {
    return request.signedCookies?.[COOKIE_NAMES.anonymousCart] as string | undefined;
  }

  private metadata(request: AppRequest) {
    return { userAgent: request.header("user-agent"), ipAddress: request.ip };
  }

  private noRefreshToken(): never {
    throw new UnauthorizedException("Refresh session is missing");
  }
}
