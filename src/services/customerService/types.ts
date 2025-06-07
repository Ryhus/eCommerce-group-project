export interface Address {
  id?: string;
  streetName: string;
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
  dateOfBirth: Date;
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
  title?: string | null;

  defaultShippingAddressId?: string | null;
  defaultBillingAddressId?: string | null;
  shippingAddressIds?: string[] | null;
  billingAddressIds?: string[] | null;
  salutation?: string | null;
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

export interface CustomerChangePassword {
  id: string | null;
  version: string | null;
  currentPassword: string | null;
  newPassword: string | null;
}
