import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AddressDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty()
  streetName!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty()
  postalCode!: string;

  @ApiProperty({ example: "DE", minLength: 2, maxLength: 2 })
  country!: string;

  @ApiProperty()
  isShipping!: boolean;

  @ApiProperty()
  isBilling!: boolean;

  @ApiProperty()
  isDefaultShipping!: boolean;

  @ApiProperty()
  isDefaultBilling!: boolean;
}

export class UserDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ format: "email" })
  email!: string;

  @ApiPropertyOptional({ nullable: true })
  firstName!: string | null;

  @ApiPropertyOptional({ nullable: true })
  lastName!: string | null;

  @ApiProperty({ example: "1990-01-01", format: "date" })
  dateOfBirth!: string;

  @ApiProperty({ type: AddressDto, isArray: true })
  addresses!: AddressDto[];
}
