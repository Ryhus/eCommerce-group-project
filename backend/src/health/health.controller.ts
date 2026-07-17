import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../database/prisma.service.js";
import { HealthDto } from "./health.dto.js";

@Controller("health")
@ApiTags("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("live")
  @ApiOkResponse({ type: HealthDto })
  live() {
    return { status: "ok" };
  }

  @Get("ready")
  @ApiOkResponse({ type: HealthDto })
  async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: "ok", database: "up" };
    } catch {
      throw new ServiceUnavailableException("Database is unavailable");
    }
  }
}
