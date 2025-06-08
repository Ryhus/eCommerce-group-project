import { apiClient } from "../apiClient";
import type { CustomerResponse, CartResponse, Address, CustomerChangePassword, UpdateCustomerProps } from "./types";
import { TokenService } from "../TokenService";

const API_URL = import.meta.env.VITE_CTP_API_URL;
const PROJECT_KEY = import.meta.env.VITE_CTP_PROJECT_KEY;

export async function signIn(email: string, password: string) {
  const response = await apiClient.post<{ customer: CustomerResponse; cart: CartResponse }>(
    `${API_URL}/${PROJECT_KEY}/login`,
    {
      email,
      password,
    }
  );

  const { customer, cart } = response.data;
  TokenService.setLogin("true");
  TokenService.setCustomerId(customer.id);
  return { customer, cart };
}

export async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  address: Address[],
  isDefaultAdress: boolean = false
) {
  let defaultShippingAddress: number | null = null;
  let defaultBillingAddress: number | null = null;
  if (isDefaultAdress) {
    defaultShippingAddress = 0;
    defaultBillingAddress = 0;
  }
  const response = await apiClient.post<{ customer: CustomerResponse; cart: CartResponse }>(
    `${API_URL}/${PROJECT_KEY}/customers`,
    {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      addresses: address,
      defaultShippingAddress,
      defaultBillingAddress,
    }
  );

  const { customer, cart } = response.data;
  TokenService.setLogin("true");
  TokenService.setCustomerId(customer.id);
  return { customer, cart };
}

export async function getCustomer(clientId: string | null) {
  const response = await apiClient.get<CustomerResponse>(`${API_URL}/${PROJECT_KEY}/customers/${clientId}`);
  const customer = response.data;
  TokenService.setCustomerVersion(customer.version.toString());
  return customer;
}

export async function updateCustomer({
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
}: UpdateCustomerProps) {
  const actions = [
    { action: "setFirstName", firstName },
    {
      action: "setLastName",
      lastName,
    },
    {
      action: "changeEmail",
      email,
    },
    {
      action: "setDateOfBirth",
      dateOfBirth,
    },
    { action: "addAddress", address },
    { action: "addShippingAddressId", addressId: shippingAddressId },
    { action: "addBillingAddressId", addressId: billingAddressId },
    { action: "changeAddress", addressId: changeAddressId, address: changedAddress },
    { action: "removeAddress", addressId: removeAddressId },
    { action: "removeShippingAddressId", addressId: removeShippingAddressId },
    { action: "removeBillingAddressId", addressId: removeBillingAddressId },
  ];

  const filteredActions = actions.filter((action) => {
    const [, value] = Object.entries(action)[1];
    return value !== undefined && value !== null;
  });

  const payload = {
    version: Number(customerVersion),
    actions: filteredActions,
  };

  const response = await apiClient.post<CustomerResponse>(`${API_URL}/${PROJECT_KEY}/customers/${customerId}`, payload);

  const customer = response.data;
  return customer;
}

export async function changePassword({ id, version, currentPassword, newPassword }: CustomerChangePassword) {
  const payload = {
    id,
    version: Number(version),
    currentPassword,
    newPassword,
  };
  const response = await apiClient.post<CustomerResponse>(`${API_URL}/${PROJECT_KEY}/customers/password`, payload);

  const customer = response.data;
  return customer;
}
