import type { Address, User } from "@prisma/client";

export type UserWithAddresses = User & { addresses: Address[] };

export function toUserDto(user: UserWithAddresses) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    dateOfBirth: user.dateOfBirth.toISOString().slice(0, 10),
    addresses: user.addresses.map((address) => ({
      id: address.id,
      streetName: address.streetName,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      isShipping: address.isShipping,
      isBilling: address.isBilling,
      isDefaultShipping: address.isDefaultShipping,
      isDefaultBilling: address.isDefaultBilling,
    })),
  };
}
