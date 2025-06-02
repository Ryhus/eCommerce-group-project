import { apiClient } from "../apiClient";
import type { CustomerResponse, CartResponse, Address } from "./types";
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
  return customer;
}
