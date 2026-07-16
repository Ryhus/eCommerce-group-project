import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import type { AppRequest } from "../common/http.types.js";
import { OptionalAccessGuard } from "../security/access.guard.js";
import { COOKIE_NAMES } from "../security/cookie.constants.js";
import { CookieService } from "../security/cookie.service.js";
import { ApplyDiscountCodeDto, AddCartItemDto, UpdateCartItemDto } from "./dto/cart.dto.js";
import { CartDto } from "./dto/cart-response.dto.js";
import { CartsService, type CartContextResult } from "./carts.service.js";

@Controller("cart")
@UseGuards(OptionalAccessGuard)
@ApiTags("cart")
export class CartsController {
  constructor(
    private readonly carts: CartsService,
    private readonly cookies: CookieService
  ) {}

  @Get()
  @ApiOkResponse({ type: CartDto })
  async get(@Req() request: AppRequest, @Res({ passthrough: true }) response: Response) {
    return this.respond(request, response, await this.carts.getOrCreate(request.user?.id, this.anonymousKey(request)));
  }

  @Post("items")
  @ApiCreatedResponse({ type: CartDto })
  async add(@Req() request: AppRequest, @Res({ passthrough: true }) response: Response, @Body() body: AddCartItemDto) {
    return this.respond(
      request,
      response,
      await this.carts.addItem(request.user?.id, this.anonymousKey(request), body.productId, body.quantity)
    );
  }

  @Patch("items/:itemId")
  @ApiOkResponse({ type: CartDto })
  async update(
    @Req() request: AppRequest,
    @Res({ passthrough: true }) response: Response,
    @Param("itemId", new ParseUUIDPipe()) itemId: string,
    @Body() body: UpdateCartItemDto
  ) {
    return this.respond(
      request,
      response,
      await this.carts.updateItem(request.user?.id, this.anonymousKey(request), itemId, body.quantity)
    );
  }

  @Delete("items/:itemId")
  @ApiOkResponse({ type: CartDto })
  async deleteItem(
    @Req() request: AppRequest,
    @Res({ passthrough: true }) response: Response,
    @Param("itemId", new ParseUUIDPipe()) itemId: string
  ) {
    return this.respond(
      request,
      response,
      await this.carts.deleteItem(request.user?.id, this.anonymousKey(request), itemId)
    );
  }

  @Delete("items")
  @ApiOkResponse({ type: CartDto })
  async clear(@Req() request: AppRequest, @Res({ passthrough: true }) response: Response) {
    return this.respond(request, response, await this.carts.clear(request.user?.id, this.anonymousKey(request)));
  }

  @Put("discount-code")
  @ApiOkResponse({ type: CartDto })
  async applyDiscount(
    @Req() request: AppRequest,
    @Res({ passthrough: true }) response: Response,
    @Body() body: ApplyDiscountCodeDto
  ) {
    return this.respond(
      request,
      response,
      await this.carts.applyDiscount(request.user?.id, this.anonymousKey(request), body.code)
    );
  }

  @Delete("discount-code")
  @ApiOkResponse({ type: CartDto })
  async removeDiscount(@Req() request: AppRequest, @Res({ passthrough: true }) response: Response) {
    return this.respond(
      request,
      response,
      await this.carts.removeDiscount(request.user?.id, this.anonymousKey(request))
    );
  }

  private anonymousKey(request: AppRequest) {
    return request.signedCookies?.[COOKIE_NAMES.anonymousCart] as string | undefined;
  }

  private respond(request: AppRequest, response: Response, result: CartContextResult) {
    if (!request.user && result.anonymousKey && result.anonymousKey !== this.anonymousKey(request)) {
      this.cookies.setAnonymousCart(response, result.anonymousKey);
    }
    return result.cart;
  }
}
