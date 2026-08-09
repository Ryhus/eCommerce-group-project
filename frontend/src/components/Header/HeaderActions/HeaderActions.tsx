import type { ComponentPropsWithoutRef } from "react";
import { PiShoppingCartSimple, PiUserCircle } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/useAuth";
import { useCart } from "../../context/useCart";

import "./HeaderActions.scss";

type HeaderActionsProps = Omit<ComponentPropsWithoutRef<"div">, "children">;

export function HeaderActions({ className = "", ...props }: HeaderActionsProps) {
  const { t } = useTranslation("common");
  const { isAuthenticated, loading, user } = useAuth();
  const { calculateTotalQuantity } = useCart();
  const totalQuantity = calculateTotalQuantity();
  const cartLabel =
    totalQuantity > 0 ? t("headerActions.cartItems", { count: totalQuantity }) : t("headerActions.cartEmpty");
  const firstName = user?.firstName?.trim() ?? "";
  const lastName = user?.lastName?.trim() ?? "";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user?.email.charAt(0).toUpperCase();
  const accountLabel = isAuthenticated
    ? firstName
      ? t("headerActions.openNamedAccount", { name: firstName })
      : t("headerActions.openAccount")
    : t("headerActions.signIn");
  const classes = `header-actions ${className}`.trim();

  return (
    <div {...props} className={classes}>
      <Link aria-label={cartLabel} className="header-actions__link header-actions__cart" to="/basket">
        <span aria-hidden="true" className="header-actions__icon">
          <PiShoppingCartSimple />
        </span>
        {totalQuantity > 0 && (
          <span aria-hidden="true" className="header-actions__badge">
            {totalQuantity > 99 ? "99+" : totalQuantity}
          </span>
        )}
      </Link>
      {loading ? (
        <span
          aria-label={t("headerActions.checkingAccount")}
          className="header-actions__account header-actions__account--loading"
          role="status"
        >
          <span aria-hidden="true" className="header-actions__account-placeholder" />
          <span aria-hidden="true" className="header-actions__account-copy">
            <span className="header-actions__placeholder-line header-actions__placeholder-line--primary" />
            <span className="header-actions__placeholder-line" />
          </span>
        </span>
      ) : (
        <Link
          aria-label={accountLabel}
          className="header-actions__account"
          to={isAuthenticated ? "/profile" : "/login"}
        >
          {isAuthenticated ? (
            <span aria-hidden="true" className="header-actions__avatar">
              {initials}
            </span>
          ) : (
            <span aria-hidden="true" className="header-actions__icon">
              <PiUserCircle />
            </span>
          )}
          <span className="header-actions__account-copy">
            <strong>{isAuthenticated ? firstName || t("headerActions.myAccount") : t("headerActions.signIn")}</strong>
            <span>{isAuthenticated ? t("headerActions.myAccount") : t("headerActions.yourAccount")}</span>
          </span>
        </Link>
      )}
    </div>
  );
}
