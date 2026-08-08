import { IsString, Matches, MinLength } from "class-validator";

export const STRONG_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_])[A-Za-z0-9!@#$%^&*(),.?":{}|<>_]{8,128}$/;

export class ChangePasswordDto {
  @IsString()
  currentPassword!: string;

  @IsString()
  @MinLength(8)
  @Matches(STRONG_PASSWORD, { message: "newPassword must contain upper, lower, number and special characters" })
  newPassword!: string;
}
