import { Type } from "class-transformer";
import { IsInt, IsString, IsUUID, Max, Min } from "class-validator";

export class AddCartItemDto {
  @IsUUID()
  productId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(999)
  quantity = 1;
}

export class UpdateCartItemDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(999)
  quantity!: number;
}

export class ApplyDiscountCodeDto {
  @IsString()
  code!: string;
}
