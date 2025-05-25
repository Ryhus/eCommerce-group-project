export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}
export interface CartResponse {
  id: string;
  version: number;
}
export interface CustomerResponse {
  id: string;
  version: number;
  email: string;
  addresses: Address[];
  isEmailVerified: boolean;
  authenticationMode: "Password" | "ExternalAuth";
  createdAt: Date;
  lastModifiedAt: Date;
}

export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: Address[];
  shippingAddresses?: number[];
  billingAddresses?: number[];
  defaultShippingAddress?: number;
  defaultBillingAddress?: number;
}
