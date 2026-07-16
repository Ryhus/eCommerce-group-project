import { createHash, randomBytes } from "node:crypto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, type JwtSignOptions } from "@nestjs/jwt";
import type { User } from "@prisma/client";
import type { AppConfig } from "../config/configuration.js";
import { PrismaService } from "../database/prisma.service.js";
import type { AccessUser } from "../common/http.types.js";

export interface SessionMetadata {
  userAgent?: string;
  ipAddress?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService<AppConfig, true>
  ) {}

  async verifyAccess(token: string): Promise<AccessUser> {
    const payload = await this.jwt.verifyAsync<{ sub: string; email: string }>(token);
    return { id: payload.sub, email: payload.email };
  }

  async issue(user: Pick<User, "id" | "email">, metadata: SessionMetadata): Promise<AuthTokens> {
    const refreshToken = randomBytes(48).toString("base64url");
    const refreshExpiresAt = new Date(
      Date.now() + this.config.get("REFRESH_TOKEN_DAYS", { infer: true }) * 24 * 60 * 60 * 1000
    );
    await this.prisma.refreshSession.create({
      data: {
        userId: user.id,
        tokenHash: this.hash(refreshToken),
        expiresAt: refreshExpiresAt,
        userAgent: metadata.userAgent,
        ipAddress: metadata.ipAddress,
      },
    });
    return {
      accessToken: await this.createAccess(user),
      refreshToken,
      refreshExpiresAt,
    };
  }

  async rotate(refreshToken: string, metadata: SessionMetadata) {
    const tokenHash = this.hash(refreshToken);
    const current = await this.prisma.refreshSession.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
    if (!current || current.expiresAt <= new Date()) throw new UnauthorizedException("Refresh session is invalid");
    if (current.revokedAt) {
      await this.prisma.refreshSession.updateMany({
        where: { userId: current.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedException("Refresh token reuse detected");
    }

    await this.prisma.refreshSession.update({ where: { id: current.id }, data: { revokedAt: new Date() } });
    return { user: current.user, tokens: await this.issue(current.user, metadata) };
  }

  async revoke(refreshToken?: string) {
    if (!refreshToken) return;
    await this.prisma.refreshSession.updateMany({
      where: { tokenHash: this.hash(refreshToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: string) {
    await this.prisma.refreshSession.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private createAccess(user: Pick<User, "id" | "email">) {
    return this.jwt.signAsync(
      { sub: user.id, email: user.email },
      { expiresIn: this.config.get("ACCESS_TOKEN_TTL", { infer: true }) as JwtSignOptions["expiresIn"] }
    );
  }

  private hash(token: string) {
    return createHash("sha256").update(token).digest("hex");
  }
}
