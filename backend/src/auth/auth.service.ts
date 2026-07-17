import { Injectable, UnauthorizedException } from "@nestjs/common";
import { verify } from "argon2";
import { CartsService } from "../carts/carts.service.js";
import { TokenService, type SessionMetadata } from "../security/token.service.js";
import { toUserDto } from "../users/user.mapper.js";
import { UsersService } from "../users/users.service.js";
import type { LoginDto, RegisterDto } from "./dto/auth.dto.js";

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly tokens: TokenService,
    private readonly carts: CartsService
  ) {}

  async register(input: RegisterDto, anonymousKey: string | undefined, metadata: SessionMetadata) {
    const user = await this.users.create(input);
    const [tokens, cart] = await Promise.all([
      this.tokens.issue(user, metadata),
      this.carts.mergeAnonymousCart(user.id, anonymousKey),
    ]);
    return { user: toUserDto(user), cart, tokens };
  }

  async login(input: LoginDto, anonymousKey: string | undefined, metadata: SessionMetadata) {
    const user = await this.users.findByEmail(input.email);
    if (!user || !(await verify(user.passwordHash, input.password))) {
      throw new UnauthorizedException("Email or password is incorrect");
    }
    const [tokens, cart] = await Promise.all([
      this.tokens.issue(user, metadata),
      this.carts.mergeAnonymousCart(user.id, anonymousKey),
    ]);
    return { user: toUserDto(user), cart, tokens };
  }
}
