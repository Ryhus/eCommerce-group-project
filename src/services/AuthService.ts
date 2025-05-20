import axios from "axios";
import { TokenService } from "./TokenService.js";
import { serverErrorHandler } from "./ErrorService.js";

export interface PasswordTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface AnonymousTokenResponse extends PasswordTokenResponse {
  anonymous_id?: string;
}

const AUTH_URL = import.meta.env.VITE_CTP_AUTH_URL;
const PROJECT_KEY = import.meta.env.VITE_CTP_PROJECT_KEY;
const CLIENT_ID = import.meta.env.VITE_CTP_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CTP_CLIENT_SECRET;
const SCOPES = import.meta.env.VITE_CTP_SCOPES;

export const AuthService = {
  authenticate: async (email: string, password: string) => {
    const data = new URLSearchParams({
      grant_type: "password",
      username: email,
      password: password,
      scope: SCOPES,
    }).toString();
    try {
      const response = await axios.post<PasswordTokenResponse>(
        `${AUTH_URL}/oauth/${PROJECT_KEY}/customers/token`,
        data,
        {
          auth: { username: CLIENT_ID, password: CLIENT_SECRET },
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const { access_token, refresh_token } = response.data;
      TokenService.setAccessToken(access_token);
      TokenService.setRefreshToken(refresh_token);

      return response.data;
    } catch (error: unknown) {
      serverErrorHandler(error);
    }
  },

  refreshAccessToken: async () => {
    const refreshToken = TokenService.getRefreshToken();

    if (!refreshToken) {
      throw new Error("Refresh token not found. User must log in again.");
    }

    const data = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }).toString();

    const response = await axios.post<PasswordTokenResponse>(`${AUTH_URL}/oauth/token`, data, {
      auth: { username: CLIENT_ID, password: CLIENT_SECRET },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { access_token, refresh_token } = response.data;
    TokenService.setAccessToken(access_token);
    TokenService.setRefreshToken(refresh_token);

    return access_token;
  },

  logout: () => {
    TokenService.clearTokens();
    window.location.href = "/login";
  },
};
