import { useTranslation } from "react-i18next";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../components/context/useAuth";

import "./GuestOnlyRoute.scss";

export function GuestOnlyRoute() {
  const { t } = useTranslation("common");
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div aria-live="polite" className="guest-only-route__status" role="status">
        <span aria-hidden="true" className="guest-only-route__spinner" />
        {t("authRoute.checkingAccount")}
      </div>
    );
  }

  if (isAuthenticated) return <Navigate replace to="/" />;

  return <Outlet />;
}
