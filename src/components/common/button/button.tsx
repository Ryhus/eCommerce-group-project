import React from "react";

import "./button.scss";

type ButtonProps = {
  text: string; // The button's text label
  variant?: "dark" | "light"; // Choose between black-bg or white-bg styles (dark by default)
  onClick?: () => void; // Optional click handler function
  className?: string; // Optional add class/classes
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  text,
  variant = "dark", // Default to the dark variant if none provided
  onClick,
  className = "",
  disabled = false,
}) => {
  const stateClass = disabled ? "btn--disabled" : "";
  const btnClass = `btn btn--${variant} ${stateClass} ${className}`.trim();

  return (
    <button className={btnClass} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;
