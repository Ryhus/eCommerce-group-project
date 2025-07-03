import React from "react";
import "./button.scss";
type ButtonProps = {
  text: string;
  variant?: "dark" | "light";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "reset" | "submit";
  icon?: React.ReactNode;
};
declare const Button: React.FC<ButtonProps>;
export default Button;
