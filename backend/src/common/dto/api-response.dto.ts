import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class MoneyDto {
  @ApiProperty({ example: 7999, description: "Amount in minor currency units" })
  amount!: number;

  @ApiProperty({ example: "EUR", enum: ["EUR"] })
  currency!: "EUR";
}

export class ApiErrorDto {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ example: "VALIDATION_ERROR" })
  code!: string;

  @ApiProperty({ example: "Request validation failed" })
  message!: string;

  @ApiPropertyOptional({ type: "object", additionalProperties: true })
  fieldErrors?: Record<string, string[]>;

  @ApiProperty({ format: "uuid" })
  requestId!: string;
}
