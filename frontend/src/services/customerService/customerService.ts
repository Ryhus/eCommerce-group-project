import { apiClient } from "../apiClient";
import type { CartResponse } from "../cartService/types";
import type { Address, CustomerChangePassword, CustomerResponse, UpdateCustomerProps } from "./types";

interface ApiUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: Address[];
}

function normalizeCustomer(user: ApiUser): CustomerResponse {
  return {
    ...user,
    shippingAddressIds: user.addresses.filter((address) => address.isShipping).map((address) => address.id!),
    billingAddressIds: user.addresses.filter((address) => address.isBilling).map((address) => address.id!),
    defaultShippingAddressId: user.addresses.find((address) => address.isDefaultShipping)?.id ?? null,
    defaultBillingAddressId: user.addresses.find((address) => address.isDefaultBilling)?.id ?? null,
  };
}

export async function signIn(email: string, password: string) {
  const response = await apiClient.post<{ user: ApiUser; cart: CartResponse }>("/auth/login", { email, password });
  return { customer: normalizeCustomer(response.data.user), cart: response.data.cart };
}

export async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  addresses: Address[],
  useAsDefaultAddress = false
) {
  const response = await apiClient.post<{ user: ApiUser; cart: CartResponse }>("/auth/register", {
    email,
    password,
    firstName,
    lastName,
    dateOfBirth,
    address: addresses[0],
    useAsDefaultAddress,
  });
  return { customer: normalizeCustomer(response.data.user), cart: response.data.cart };
}

export async function logout() {
  await apiClient.post("/auth/logout");
}

export async function getCustomer() {
  return normalizeCustomer((await apiClient.get<ApiUser>("/auth/me")).data);
}

export async function updateCustomer(input: UpdateCustomerProps) {
  let user: ApiUser;
  if (input.removeAddressId) {
    user = (await apiClient.delete<ApiUser>(`/users/me/addresses/${input.removeAddressId}`)).data;
  } else if (input.removeShippingAddressId) {
    user = (
      await apiClient.patch<ApiUser>(`/users/me/addresses/${input.removeShippingAddressId}`, { isShipping: false })
    ).data;
  } else if (input.removeBillingAddressId) {
    user = (await apiClient.patch<ApiUser>(`/users/me/addresses/${input.removeBillingAddressId}`, { isBilling: false }))
      .data;
  } else if (input.address) {
    user = (await apiClient.post<ApiUser>("/users/me/addresses", input.address)).data;
  } else if (input.changeAddressId && input.changedAddress) {
    user = (
      await apiClient.patch<ApiUser>(`/users/me/addresses/${input.changeAddressId}`, {
        ...input.changedAddress,
        isDefaultBilling: input.defaultBillingAddressId === input.changeAddressId || undefined,
        isDefaultShipping: input.defaultShippingAddressId === input.changeAddressId || undefined,
      })
    ).data;
  } else {
    const addressId =
      input.billingAddressId ??
      input.shippingAddressId ??
      input.defaultBillingAddressId ??
      input.defaultShippingAddressId;
    if (addressId) {
      user = (
        await apiClient.patch<ApiUser>(`/users/me/addresses/${addressId}`, {
          isBilling: input.billingAddressId ? true : undefined,
          isShipping: input.shippingAddressId ? true : undefined,
          isDefaultBilling: input.defaultBillingAddressId ? true : undefined,
          isDefaultShipping: input.defaultShippingAddressId ? true : undefined,
        })
      ).data;
    } else {
      user = (
        await apiClient.patch<ApiUser>("/users/me", {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          dateOfBirth: input.dateOfBirth,
        })
      ).data;
    }
  }
  return normalizeCustomer(user);
}

export async function changePassword({ currentPassword, newPassword }: CustomerChangePassword) {
  const user = (await apiClient.post<ApiUser>("/users/me/password", { currentPassword, newPassword })).data;
  return normalizeCustomer(user);
}
