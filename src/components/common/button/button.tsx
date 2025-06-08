import React from "react";

import "./button.scss";

type ButtonProps = {
  text: string; // The button's text label
  variant?: "dark" | "light"; // Choose between black-bg or white-bg styles (dark by default)
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // Optional click handler function
  className?: string; // Optional add class/classes
  disabled?: boolean;
  type?: "button" | "reset" | "submit";
  icon?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  type = "button",
  text,
  variant = "dark", // Default to the dark variant if none provided
  onClick,
  className = "",
  disabled = false,
  icon,
}) => {
  const stateClass = disabled ? "btn--disabled" : "";
  const btnClass = `btn btn--${variant} ${stateClass} ${className}`.trim();

  return (
    <button className={btnClass} onClick={onClick} disabled={disabled} type={type}>
      {icon && <span className="button-icon">{icon}</span>}
      {text}
    </button>
  );
};

export default Button;
