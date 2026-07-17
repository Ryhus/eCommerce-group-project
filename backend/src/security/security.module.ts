import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import type { AppConfig } from "../config/configuration.js";
import { AccessGuard, OptionalAccessGuard } from "./access.guard.js";
import { CookieService } from "./cookie.service.js";
import { CsrfGuard } from "./csrf.guard.js";
import { TokenService } from "./token.service.js";

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig, true>) => ({
        secret: config.get("JWT_ACCESS_SECRET", { infer: true }),
      }),
    }),
  ],
  providers: [
    TokenService,
    CookieService,
    AccessGuard,
    OptionalAccessGuard,
    { provide: APP_GUARD, useClass: CsrfGuard },
  ],
  exports: [TokenService, CookieService, AccessGuard, OptionalAccessGuard],
})
export class SecurityModule {}
