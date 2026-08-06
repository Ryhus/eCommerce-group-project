import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";

import { CreateNewsletterSubscriptionDto, NewsletterSubscriptionDto } from "./dto/newsletter-subscription.dto.js";
import { NewsletterService } from "./newsletter.service.js";

@Controller("newsletter")
@ApiTags("newsletter")
export class NewsletterController {
  constructor(private readonly newsletter: NewsletterService) {}

  @Post("subscriptions")
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiCreatedResponse({ type: NewsletterSubscriptionDto })
  subscribe(@Body() input: CreateNewsletterSubscriptionDto) {
    return this.newsletter.subscribe(input.email);
  }
}
