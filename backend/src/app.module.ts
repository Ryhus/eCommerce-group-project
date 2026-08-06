import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./auth/auth.module.js";
import { CartsModule } from "./carts/carts.module.js";
import { CatalogModule } from "./catalog/catalog.module.js";
import { validateConfig } from "./config/configuration.js";
import { DatabaseModule } from "./database/database.module.js";
import { HealthModule } from "./health/health.module.js";
import { NewsletterModule } from "./newsletter/newsletter.module.js";
import { PromotionsModule } from "./promotions/promotions.module.js";
import { SecurityModule } from "./security/security.module.js";
import { UsersModule } from "./users/users.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateConfig }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    DatabaseModule,
    SecurityModule,
    HealthModule,
    NewsletterModule,
    UsersModule,
    CatalogModule,
    PromotionsModule,
    CartsModule,
    AuthModule,
  ],
})
export class AppModule {}
