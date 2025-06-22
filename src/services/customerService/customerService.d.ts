import type { CustomerResponse, Address, CustomerChangePassword, UpdateCustomerProps } from "./types";
import type { CartResponse } from "../cartService/types";
export declare function signIn(
  email: string,
  password: string,
  anonymousCart?: {
    id: string | null;
  }
): Promise<{
  customer: CustomerResponse;
  cart: CartResponse;
}>;
export declare function signInMe(
  email: string,
  password: string,
  anonymousCart?: {
    id: string;
  }
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
  address: Address[],
  isDefaultAdress?: boolean,
  anonymousCart?: {
    id: string | null;
  }
): Promise<{
  customer: CustomerResponse;
  cart: CartResponse;
}>;
export declare function getCustomer(clientId: string | null): Promise<CustomerResponse>;
export declare function updateCustomer({
  customerId,
  customerVersion,
  firstName,
  lastName,
  email,
  dateOfBirth,
  address,
  changeAddressId,
  changedAddress,
  billingAddressId,
  shippingAddressId,
  removeAddressId,
  removeShippingAddressId,
  removeBillingAddressId,
  defaultShippingAddressId,
  defaultBillingAddressId,
}: UpdateCustomerProps): Promise<CustomerResponse>;
export declare function changePassword({
  id,
  version,
  currentPassword,
  newPassword,
}: CustomerChangePassword): Promise<CustomerResponse>;
