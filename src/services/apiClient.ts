import axios from "axios";
import type { AxiosInstance } from "axios";
import { TokenService } from "./TokenService";
import { AuthService } from "./AuthService";

const API_URL = import.meta.env.VITE_CTP_API_URL;

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

// request interceptor automatically adds Authorization header if token exists
apiClient.interceptors.request.use((config) => {
  const token = TokenService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// response interceptor automatically intercepts response and refresh keys if possible
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await AuthService.refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        AuthService.logout();
      }
    }

    return Promise.reject(error);
  }
);
