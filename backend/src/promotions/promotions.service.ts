import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service.js";

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}

  async publicPromotions() {
    const promotions = await this.prisma.discountCode.findMany({ where: { isPublic: true }, orderBy: { code: "asc" } });
    const now = new Date();
    return promotions.map((promotion) => ({
      id: promotion.id,
      code: promotion.code,
      description: promotion.description,
      isActive:
        promotion.isActive &&
        (!promotion.startsAt || promotion.startsAt <= now) &&
        (!promotion.endsAt || promotion.endsAt >= now),
    }));
  }
}
