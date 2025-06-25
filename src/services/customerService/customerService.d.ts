import type { CustomerResponse, CartResponse } from "./types";
export declare function signIn(
  email: string,
  password: string
): Promise<{
  customer: CustomerResponse;
  cart: CartResponse;
}>;
export declare function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  address: [
    {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    },
  ]
): Promise<{
  customer: CustomerResponse;
  cart: CartResponse;
}>;
