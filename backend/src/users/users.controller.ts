import { Body, Controller, Delete, Param, Patch, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiCookieAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import type { AppRequest } from "../common/http.types.js";
import { AccessGuard } from "../security/access.guard.js";
import { CookieService } from "../security/cookie.service.js";
import { TokenService } from "../security/token.service.js";
import { CreateAddressDto, UpdateAddressDto } from "./dto/address.dto.js";
import { ChangePasswordDto } from "./dto/change-password.dto.js";
import { UpdateProfileDto } from "./dto/update-profile.dto.js";
import { UserDto } from "./dto/user.dto.js";
import { toUserDto } from "./user.mapper.js";
import { UsersService } from "./users.service.js";

@Controller("users/me")
@UseGuards(AccessGuard)
@ApiTags("users")
@ApiCookieAuth()
export class UsersController {
  constructor(
    private readonly users: UsersService,
    private readonly tokens: TokenService,
    private readonly cookies: CookieService
  ) {}

  @Patch()
  @ApiOkResponse({ type: UserDto })
  update(@Req() request: AppRequest, @Body() body: UpdateProfileDto) {
    return this.users.updateProfile(request.user!.id, body);
  }

  @Post("password")
  @ApiCreatedResponse({ type: UserDto })
  async changePassword(
    @Req() request: AppRequest,
    @Res({ passthrough: true }) response: Response,
    @Body() body: ChangePasswordDto
  ) {
    const user = await this.users.changePassword(request.user!.id, body);
    await this.tokens.revokeAllForUser(user.id);
    const tokens = await this.tokens.issue(user, {
      userAgent: request.header("user-agent"),
      ipAddress: request.ip,
    });
    this.cookies.setAuth(response, tokens.accessToken, tokens.refreshToken, tokens.refreshExpiresAt);
    return toUserDto(user);
  }

  @Post("addresses")
  @ApiCreatedResponse({ type: UserDto })
  createAddress(@Req() request: AppRequest, @Body() body: CreateAddressDto) {
    return this.users.createAddress(request.user!.id, body);
  }

  @Patch("addresses/:addressId")
  @ApiOkResponse({ type: UserDto })
  updateAddress(@Req() request: AppRequest, @Param("addressId") addressId: string, @Body() body: UpdateAddressDto) {
    return this.users.updateAddress(request.user!.id, addressId, body);
  }

  @Delete("addresses/:addressId")
  @ApiOkResponse({ type: UserDto })
  deleteAddress(@Req() request: AppRequest, @Param("addressId") addressId: string) {
    return this.users.deleteAddress(request.user!.id, addressId);
  }
}
