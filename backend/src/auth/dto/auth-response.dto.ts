import { ApiProperty } from "@nestjs/swagger";
import { CartDto } from "../../carts/dto/cart-response.dto.js";
import { UserDto } from "../../users/dto/user.dto.js";

export class CsrfDto {
  @ApiProperty()
  csrfToken!: string;
}

export class AuthResponseDto {
  @ApiProperty({ type: UserDto })
  user!: UserDto;

  @ApiProperty({ type: CartDto })
  cart!: CartDto;
}
