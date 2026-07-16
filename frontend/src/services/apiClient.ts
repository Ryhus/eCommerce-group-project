import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api/v1";
const rawClient = axios.create({ baseURL, withCredentials: true });

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let csrfToken: string | null = null;
let csrfPromise: Promise<string> | null = null;
let refreshPromise: Promise<void> | null = null;

async function ensureCsrfToken() {
  if (csrfToken) return csrfToken;
  csrfPromise ??= rawClient.get<{ csrfToken: string }>("/auth/csrf").then((response) => response.data.csrfToken);
  try {
    csrfToken = await csrfPromise;
    return csrfToken;
  } finally {
    csrfPromise = null;
  }
}

apiClient.interceptors.request.use(async (config) => {
  const method = config.method?.toUpperCase() ?? "GET";
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    config.headers.set("X-CSRF-Token", await ensureCsrfToken());
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const isAuthRequest = request?.url?.includes("/auth/login") || request?.url?.includes("/auth/register");
    if (error.response?.status === 401 && request && !request._retry && !isAuthRequest) {
      request._retry = true;
      refreshPromise ??= ensureCsrfToken()
        .then((token) => rawClient.post("/auth/refresh", undefined, { headers: { "X-CSRF-Token": token } }))
        .then(() => undefined)
        .finally(() => {
          refreshPromise = null;
        });
      await refreshPromise;
      return apiClient(request);
    }
    return Promise.reject(error);
  }
);
