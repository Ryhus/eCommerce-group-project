import { Transform } from "class-transformer";
import { IsEmail, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateNewsletterSubscriptionDto {
  @ApiProperty({ example: "shopper@example.com", maxLength: 254 })
  @Transform(({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value))
  @IsEmail()
  @MaxLength(254)
  email!: string;
}

export class NewsletterSubscriptionDto {
  @ApiProperty({ example: "shopper@example.com" })
  email!: string;

  @ApiProperty({ format: "date-time" })
  subscribedAt!: string;
}
