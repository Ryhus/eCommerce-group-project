import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString, Length, Matches, MaxLength, MinLength } from "class-validator";

export class CreateAddressDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  streetName!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(80)
  city!: string;

  @IsString()
  @Length(3, 16)
  postalCode!: string;

  @Transform(({ value }) => String(value).toUpperCase())
  @Matches(/^[A-Z]{2}$/)
  country!: string;

  @IsOptional()
  @IsBoolean()
  isShipping = false;

  @IsOptional()
  @IsBoolean()
  isBilling = false;

  @IsOptional()
  @IsBoolean()
  isDefaultShipping = false;

  @IsOptional()
  @IsBoolean()
  isDefaultBilling = false;
}

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  streetName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  city?: string;

  @IsOptional()
  @IsString()
  @Length(3, 16)
  postalCode?: string;

  @IsOptional()
  @Transform(({ value }) => String(value).toUpperCase())
  @Matches(/^[A-Z]{2}$/)
  country?: string;

  @IsOptional()
  @IsBoolean()
  isShipping?: boolean;

  @IsOptional()
  @IsBoolean()
  isBilling?: boolean;

  @IsOptional()
  @IsBoolean()
  isDefaultShipping?: boolean;

  @IsOptional()
  @IsBoolean()
  isDefaultBilling?: boolean;
}
