import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { PromotionDto } from "./promotion.dto.js";
import { PromotionsService } from "./promotions.service.js";

@Controller("promotions")
@ApiTags("promotions")
export class PromotionsController {
  constructor(private readonly promotions: PromotionsService) {}

  @Get("public")
  @ApiOkResponse({ type: PromotionDto, isArray: true })
  list() {
    return this.promotions.publicPromotions();
  }
}
