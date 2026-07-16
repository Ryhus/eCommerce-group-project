import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { DiscountType } from "@prisma/client";

export class PromotionDto {
  @ApiProperty()
  code!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ enum: DiscountType })
  type!: DiscountType;

  @ApiPropertyOptional({ nullable: true })
  percentageBasisPoints!: number | null;

  @ApiPropertyOptional({ nullable: true })
  fixedAmount!: number | null;

  @ApiProperty()
  minimumSubtotal!: number;

  @ApiProperty({ example: "EUR", enum: ["EUR"] })
  currency!: string;

  @ApiPropertyOptional({ format: "date-time", nullable: true })
  startsAt!: string | null;

  @ApiPropertyOptional({ format: "date-time", nullable: true })
  endsAt!: string | null;
}
