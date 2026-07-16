import { Transform } from "class-transformer";
import { IsDateString, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @Transform(({ value }) => String(value).trim().toLowerCase())
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  @Matches(/^[\p{L}\s'-]+$/u)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  @Matches(/^[\p{L}\s'-]+$/u)
  lastName?: string;

  @IsOptional()
  @IsDateString({ strict: true })
  dateOfBirth?: string;
}
