import { apiClient } from "../apiClient";
import type { CustomerResponse, CartResponse } from "./types";

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
  return { customer, cart };
}

export async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  address: [{ street: string; city: string; postalCode: string; country: string }]
) {
  const response = await apiClient.post<{ customer: CustomerResponse; cart: CartResponse }>(
    `${API_URL}/${PROJECT_KEY}/customers`,
    {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      address,
    }
  );

  const { customer, cart } = response.data;
  return { customer, cart };
}
