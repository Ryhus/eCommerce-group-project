import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getCustomer, logout as logoutRequest } from "../../services/customerService/customerService";
import type { CustomerResponse } from "../../services/customerService/types";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCustomer();
      setUser(currentUser);
      return currentUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  return (
    <AuthContext value={{ user, isAuthenticated: Boolean(user), loading, refreshUser, logout }}>{children}</AuthContext>
  );
}
