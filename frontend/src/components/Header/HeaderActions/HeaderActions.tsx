import type { ComponentPropsWithoutRef } from "react";
import { PiShoppingCartSimple, PiUserCircle } from "react-icons/pi";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/useAuth";
import { useCart } from "../../context/useCart";

import "./HeaderActions.scss";

type HeaderActionsProps = Omit<ComponentPropsWithoutRef<"div">, "children">;

export function HeaderActions({ className = "", ...props }: HeaderActionsProps) {
  const { isAuthenticated } = useAuth();
  const { calculateTotalQuantity } = useCart();
  const totalQuantity = calculateTotalQuantity();
  const cartLabel = totalQuantity > 0 ? `Shopping cart, ${totalQuantity} items` : "Shopping cart, empty";
  const accountLabel = isAuthenticated ? "Open profile" : "Log in";
  const classes = `header-actions ${className}`.trim();

  return (
    <div {...props} className={classes}>
      <Link aria-label={cartLabel} className="header-actions__link" to="/basket">
        <span aria-hidden="true" className="header-actions__icon">
          <PiShoppingCartSimple />
        </span>
        {totalQuantity > 0 && (
          <span aria-hidden="true" className="header-actions__badge">
            {totalQuantity > 99 ? "99+" : totalQuantity}
          </span>
        )}
      </Link>
      <Link aria-label={accountLabel} className="header-actions__link" to={isAuthenticated ? "/profile" : "/login"}>
        <span aria-hidden="true" className="header-actions__icon">
          <PiUserCircle />
        </span>
      </Link>
    </div>
  );
}
