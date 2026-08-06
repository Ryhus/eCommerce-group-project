import type { ComponentPropsWithoutRef, ReactNode } from "react";

import "./IconButton.scss";

type IconButtonSize = "medium" | "small";
type IconButtonVariant = "ghost" | "subtle";

type IconButtonProps = Omit<ComponentPropsWithoutRef<"button">, "aria-label" | "children"> & {
  label: string;
  icon: ReactNode;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
};

export function IconButton({
  label,
  icon,
  size = "medium",
  variant = "ghost",
  type = "button",
  className = "",
  ...props
}: IconButtonProps) {
  const classes = `icon-button icon-button--${size} icon-button--${variant} ${className}`.trim();

  return (
    <button {...props} aria-label={label} className={classes} type={type}>
      <span aria-hidden="true" className="icon-button__icon">
        {icon}
      </span>
    </button>
  );
}
