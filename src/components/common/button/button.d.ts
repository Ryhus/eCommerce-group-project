import React from "react";
import "./button.scss";
type ButtonProps = {
  text: string;
  variant?: "dark" | "light";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};
declare const Button: React.FC<ButtonProps>;
export default Button;
