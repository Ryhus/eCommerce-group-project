import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Response } from "express";
import type { AppConfig } from "../config/configuration.js";
import { COOKIE_NAMES } from "./cookie.constants.js";

@Injectable()
export class CookieService {
  private readonly secure: boolean;

  constructor(private readonly config: ConfigService<AppConfig, true>) {
    this.secure = config.get("NODE_ENV", { infer: true }) === "production";
  }

  setAuth(response: Response, accessToken: string, refreshToken: string, refreshExpiresAt: Date) {
    response.cookie(COOKIE_NAMES.access, accessToken, {
      httpOnly: true,
      secure: this.secure,
      sameSite: "lax",
      path: "/api",
      maxAge: 15 * 60 * 1000,
    });
    response.cookie(COOKIE_NAMES.refresh, refreshToken, {
      httpOnly: true,
      secure: this.secure,
      sameSite: "lax",
      path: "/api/v1/auth",
      expires: refreshExpiresAt,
    });
  }

  clearAuth(response: Response) {
    response.clearCookie(COOKIE_NAMES.access, { path: "/api" });
    response.clearCookie(COOKIE_NAMES.refresh, { path: "/api/v1/auth" });
  }

  setCsrf(response: Response, token: string) {
    response.cookie(COOKIE_NAMES.csrf, token, {
      httpOnly: false,
      secure: this.secure,
      sameSite: "lax",
      path: "/",
    });
  }

  setAnonymousCart(response: Response, key: string) {
    response.cookie(COOKIE_NAMES.anonymousCart, key, {
      httpOnly: true,
      secure: this.secure,
      sameSite: "lax",
      signed: true,
      path: "/api",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  clearAnonymousCart(response: Response) {
    response.clearCookie(COOKIE_NAMES.anonymousCart, { path: "/api" });
  }
}
