import { ValidationPipe, type INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { ApiExceptionFilter } from "./common/api-exception.filter.js";
import { ApiErrorDto } from "./common/dto/api-response.dto.js";
import { requestIdMiddleware } from "./common/request-id.middleware.js";
import type { AppConfig } from "./config/configuration.js";
import { COOKIE_NAMES } from "./security/cookie.constants.js";

export function configureApp(app: INestApplication) {
  const config = app.get<ConfigService<AppConfig, true>>(ConfigService);
  app.setGlobalPrefix("api/v1");
  app.use(cookieParser(config.get("COOKIE_SECRET", { infer: true })));
  app.use(helmet());
  app.use(requestIdMiddleware);
  if (config.get("NODE_ENV", { infer: true }) !== "test") {
    app.use(pinoHttp({ redact: ["req.headers.cookie", "req.headers.authorization", "res.headers.set-cookie"] }));
  }
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new ApiExceptionFilter());

  if (config.get("NODE_ENV", { infer: true }) !== "production") {
    app.enableCors({ origin: config.get("FRONTEND_ORIGIN", { infer: true }), credentials: true });
    const swagger = new DocumentBuilder()
      .setTitle("Sport Gear API")
      .setVersion("1.0")
      .addCookieAuth(COOKIE_NAMES.access)
      .build();
    SwaggerModule.setup("api/docs", app, SwaggerModule.createDocument(app, swagger, { extraModels: [ApiErrorDto] }));
  }
  return config;
}
