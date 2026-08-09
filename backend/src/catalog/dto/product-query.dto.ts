import { Transform, Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from "class-validator";

function listValue(value: unknown): string[] | undefined {
  if (value == null) return undefined;
  const values = (Array.isArray(value) ? value : String(value).split(","))
    .flatMap((item) => String(item).split(","))
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return values.length ? [...new Set(values)] : undefined;
}

export enum ProductSort {
  RELEVANCE = "RELEVANCE",
  PRICE_ASC = "PRICE_ASC",
  PRICE_DESC = "PRICE_DESC",
  NAME_ASC = "NAME_ASC",
  NAME_DESC = "NAME_DESC",
}

export class ProductQueryDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Transform(({ value }) => listValue(value))
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  colors?: string[];

  @IsOptional()
  @Transform(({ value }) => listValue(value))
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  sizes?: string[];

  @IsOptional()
  @Transform(({ value }) => listValue(value))
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  equipmentTypes?: string[];

  @IsOptional()
  @IsEnum(ProductSort)
  sort: ProductSort = ProductSort.RELEVANCE;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;
}
