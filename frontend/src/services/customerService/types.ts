export interface Address {
  id?: string;
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
  isShipping?: boolean;
  isBilling?: boolean;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

export interface CustomerResponse {
  id: string;
  email: string;
  addresses: Address[];
  dateOfBirth: string;
  firstName?: string | null;
  lastName?: string | null;
  defaultShippingAddressId?: string | null;
  defaultBillingAddressId?: string | null;
  shippingAddressIds?: string[] | null;
  billingAddressIds?: string[] | null;
}

export interface CustomerChangePassword {
  currentPassword: string | null;
  newPassword: string | null;
}

export interface UpdateCustomerProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  address?: Address;
  changeAddressId?: string;
  changedAddress?: Address;
  removeAddressId?: string;
  removeShippingAddressId?: string;
  removeBillingAddressId?: string;
  billingAddressId?: string;
  shippingAddressId?: string;
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;
}
