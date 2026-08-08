import type { ComponentPropsWithoutRef } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import "./HeaderNavigation.scss";

const navigationItems = [
  { labelKey: "navigation.home", to: "/", end: true },
  { labelKey: "navigation.shop", to: "/catalog", end: false },
  { labelKey: "navigation.about", to: "/about", end: true },
] as const;

type HeaderNavigationProps = Omit<ComponentPropsWithoutRef<"nav">, "aria-label" | "children"> & {
  onNavigate?: () => void;
  orientation?: "horizontal" | "vertical";
};

export function HeaderNavigation({
  className = "",
  onNavigate,
  orientation = "horizontal",
  ...props
}: HeaderNavigationProps) {
  const { t } = useTranslation("common");
  const classes = `header-navigation header-navigation--${orientation} ${className}`.trim();

  return (
    <nav {...props} aria-label={t("navigation.primary")} className={classes}>
      {navigationItems.map(({ end, labelKey, to }) => (
        <NavLink
          className={({ isActive }) => `header-navigation__link${isActive ? " is-active" : ""}`}
          end={end}
          key={to}
          onClick={onNavigate}
          to={to}
        >
          {t(labelKey)}
        </NavLink>
      ))}
    </nav>
  );
}
