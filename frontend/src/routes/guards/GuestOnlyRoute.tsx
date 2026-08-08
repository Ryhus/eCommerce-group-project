import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../components/context/useAuth";

import "./GuestOnlyRoute.scss";

export function GuestOnlyRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div aria-live="polite" className="guest-only-route__status" role="status">
        <span aria-hidden="true" className="guest-only-route__spinner" />
        Checking your account…
      </div>
    );
  }

  if (isAuthenticated) return <Navigate replace to="/" />;

  return <Outlet />;
}
