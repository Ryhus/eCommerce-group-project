export declare const TokenService: {
  getAccessToken: () => string | null;
  setAccessToken: (token: string) => void;
  removeAccessToken: () => void;
  getRefreshToken: () => string | null;
  setRefreshToken: (token: string) => void;
  removeRefreshToken: () => void;
  clearTokens: () => void;
};
