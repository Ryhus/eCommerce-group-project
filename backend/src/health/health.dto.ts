import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class HealthDto {
  @ApiProperty({ example: "ok" })
  status!: string;

  @ApiPropertyOptional({ example: "up" })
  database?: string;
}
