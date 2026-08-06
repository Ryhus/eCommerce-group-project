import type { ComponentPropsWithoutRef } from "react";
import { NavLink } from "react-router-dom";

import "./HeaderNavigation.scss";

const navigationItems = [
  { label: "Home", to: "/", end: true },
  { label: "Shop", to: "/catalog", end: false },
  { label: "About", to: "/about", end: true },
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
  const classes = `header-navigation header-navigation--${orientation} ${className}`.trim();

  return (
    <nav {...props} aria-label="Primary navigation" className={classes}>
      {navigationItems.map(({ end, label, to }) => (
        <NavLink
          className={({ isActive }) => `header-navigation__link${isActive ? " is-active" : ""}`}
          end={end}
          key={to}
          onClick={onNavigate}
          to={to}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
