import { apiClient } from "../apiClient";

const API_URL = import.meta.env.VITE_CTP_API_URL;
const PROJECT_KEY = import.meta.env.VITE_CTP_PROJECT_KEY;

export async function signIn(email: string, password: string) {
  const response = await apiClient.post(`${API_URL}/${PROJECT_KEY}/login`, {
    email,
    password,
  });

  const { customer, cart } = response.data;
  return { customer, cart };
}
