import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { MoneyDto } from "../../common/dto/api-response.dto.js";

export class CartItemDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ format: "uuid" })
  productId!: string;

  @ApiProperty({ format: "uuid" })
  variantId!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional({ format: "uri", nullable: true })
  image!: string | null;

  @ApiProperty()
  quantity!: number;

  @ApiProperty({ type: MoneyDto })
  unitPrice!: MoneyDto;

  @ApiProperty({ type: MoneyDto })
  lineTotal!: MoneyDto;
}

export class CartDiscountCodeDto {
  @ApiProperty()
  code!: string;

  @ApiProperty()
  description!: string;
}

export class CartDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ type: CartItemDto, isArray: true })
  items!: CartItemDto[];

  @ApiProperty()
  totalQuantity!: number;

  @ApiProperty({ type: MoneyDto })
  subtotal!: MoneyDto;

  @ApiProperty({ type: MoneyDto })
  discount!: MoneyDto;

  @ApiProperty({ type: MoneyDto })
  total!: MoneyDto;

  @ApiPropertyOptional({ type: CartDiscountCodeDto, nullable: true })
  discountCode!: CartDiscountCodeDto | null;
}
