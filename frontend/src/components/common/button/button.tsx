import type { ComponentPropsWithoutRef, ReactNode } from "react";

import "./button.scss";

type ButtonProps = Omit<ComponentPropsWithoutRef<"button">, "children"> & {
  text: string;
  variant?: "dark" | "light";
  icon?: ReactNode;
};

const Button = ({
  type = "button",
  text,
  variant = "dark",
  className = "",
  disabled = false,
  icon,
  ...props
}: ButtonProps) => {
  const stateClass = disabled ? "btn--disabled" : "";
  const btnClass = `btn btn--${variant} ${stateClass} ${className}`.trim();

  return (
    <button {...props} className={btnClass} disabled={disabled} type={type}>
      {icon && <span className="button-icon">{icon}</span>}
      {text}
    </button>
  );
};

export default Button;
