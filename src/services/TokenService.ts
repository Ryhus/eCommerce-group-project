// TokenService is an Object with set of functions to manage tokens in the storage

export const TokenService = {
  setAccessToken: (token: string) => localStorage.setItem("accessToken", token),
  getAccessToken: (): string | null => localStorage.getItem("accessToken"),
  removeAccessToken: () => localStorage.removeItem("accessToken"),

  setAnonSessionId: (anonymousId: string) => localStorage.setItem("anonymousId", anonymousId),
  getAnonSessionId: (): string | null => localStorage.getItem("anonymousId"),
  removeAnonSessionId: () => localStorage.removeItem("anonymousId"),

  setLogin: (logeIn: string = "true") => localStorage.setItem("loginState", logeIn),
  getLogin: (): string | null => localStorage.getItem("loginState"),
  removeLogin: () => localStorage.removeItem("loginState"),

  setCustomerVersion: (customerVersion: string) => localStorage.setItem("customerVersion", customerVersion),
  setCustomerId: (customerId: string) => localStorage.setItem("customerId", customerId),
  getCustomerId: (): string | null => localStorage.getItem("customerId"),
  getCustomerVersion: (): string | null => localStorage.getItem("customerVersion"),

  setCartId: (cartId: string) => localStorage.setItem("cartId", cartId),
  setCartVersion: (cartVersion: string) => localStorage.setItem("cartVersion", cartVersion),
  removeCartId: () => localStorage.removeItem("cartId"),

  getCartId: (): string | null => localStorage.getItem("cartId"),
  getCartVersion: (): string | null => localStorage.getItem("cartVersion"),

  setRefreshToken: (token: string) => localStorage.setItem("refreshToken", token),
  getRefreshToken: (): string | null => localStorage.getItem("refreshToken"),
  removeRefreshToken: () => localStorage.removeItem("refreshToken"),

  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("loginState");
    localStorage.removeItem("customerId");
    localStorage.removeItem("customerVersion");
    localStorage.removeItem("anonymousId");
    localStorage.removeItem("cartId");
  },
};
