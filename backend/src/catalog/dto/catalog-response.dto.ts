import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { MoneyDto } from "../../common/dto/api-response.dto.js";

export class ProductImageDto {
  @ApiProperty({ format: "uri" })
  url!: string;

  @ApiPropertyOptional({ nullable: true })
  alt!: string | null;
}

export class ProductDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiProperty({ type: ProductImageDto, isArray: true })
  images!: ProductImageDto[];

  @ApiProperty({ type: MoneyDto })
  price!: MoneyDto;

  @ApiPropertyOptional({ type: MoneyDto, nullable: true })
  compareAtPrice!: MoneyDto | null;

  @ApiProperty({ type: String, isArray: true, format: "uuid" })
  categoryIds!: string[];
}

export class ProductPageDto {
  @ApiProperty({ type: ProductDto, isArray: true })
  items!: ProductDto[];

  @ApiProperty()
  offset!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  total!: number;
}

export class CategoryDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty()
  key!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiPropertyOptional({ format: "uuid", nullable: true })
  parentId!: string | null;

  @ApiProperty({ type: () => CategoryDto, isArray: true })
  children!: CategoryDto[];
}
