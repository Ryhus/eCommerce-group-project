import { Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";
import { CreateAddressDto } from "../../users/dto/address.dto.js";
import { STRONG_PASSWORD } from "../../users/dto/change-password.dto.js";

export class LoginDto {
  @Transform(({ value }) => String(value).trim().toLowerCase())
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class RegisterDto {
  @Transform(({ value }) => String(value).trim().toLowerCase())
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @Matches(STRONG_PASSWORD, { message: "password must contain upper, lower, number and special characters" })
  password!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(80)
  @Matches(/^[\p{L}\s'-]+$/u)
  firstName!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(80)
  @Matches(/^[\p{L}\s'-]+$/u)
  lastName!: string;

  @IsDateString({ strict: true })
  dateOfBirth!: string;

  @ValidateNested()
  @Type(() => CreateAddressDto)
  address!: CreateAddressDto;

  @IsOptional()
  @IsBoolean()
  useAsDefaultAddress = false;
}
