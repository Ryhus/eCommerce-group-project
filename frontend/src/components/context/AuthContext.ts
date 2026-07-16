import { createContext } from "react";
import type { CustomerResponse } from "../../services/customerService/types";

export interface AuthContextValue {
  user: CustomerResponse | null;
  isAuthenticated: boolean;
  loading: boolean;
  refreshUser: () => Promise<CustomerResponse | null>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
