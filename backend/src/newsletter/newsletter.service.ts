import { Injectable } from "@nestjs/common";

import { PrismaService } from "../database/prisma.service.js";

@Injectable()
export class NewsletterService {
  constructor(private readonly prisma: PrismaService) {}

  async subscribe(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const subscription = await this.prisma.newsletterSubscription.upsert({
      where: { email: normalizedEmail },
      update: {},
      create: { email: normalizedEmail },
      select: { email: true, createdAt: true },
    });

    return {
      email: subscription.email,
      subscribedAt: subscription.createdAt.toISOString(),
    };
  }
}
