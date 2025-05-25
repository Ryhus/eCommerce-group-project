// TokenService is an Object with set of functions to manage tokens in the storage

export const TokenService = {
  getAccessToken: (): string | null => localStorage.getItem("accessToken"),
  setAccessToken: (token: string) => localStorage.setItem("accessToken", token),
  setLogin: (logeIn: string = "true") => localStorage.setItem("loginState", logeIn),
  removeAccessToken: () => localStorage.removeItem("accessToken"),

  getRefreshToken: (): string | null => localStorage.getItem("refreshToken"),
  setRefreshToken: (token: string) => localStorage.setItem("refreshToken", token),
  removeRefreshToken: () => localStorage.removeItem("refreshToken"),

  getLogin: (): string | null => localStorage.getItem("loginState"),
  removeLogin: () => localStorage.removeItem("loginState"),

  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("loginState");
  },
};
