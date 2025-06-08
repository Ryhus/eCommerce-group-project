export declare const TokenService: {
    getAccessToken: () => string | null;
    setAccessToken: (token: string) => void;
    setLogin: (logeIn?: string) => void;
    removeAccessToken: () => void;
    setCustomerId: (customerId: string) => void;
    setCustomerVersion: (customerVersion: string) => void;
    getRefreshToken: () => string | null;
    setRefreshToken: (token: string) => void;
    removeRefreshToken: () => void;
    getLogin: () => string | null;
    removeLogin: () => void;
    getCustomerId: () => string | null;
    getCustomerVersion: () => string | null;
    clearTokens: () => void;
};
