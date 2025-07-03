import React from "react";
import "./inputField.scss";
type InputFieldProps = {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  isValid?: boolean;
  wrapperClassName?: string;
  inputClassName?: string;
  type?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};
declare const InputField: React.FC<InputFieldProps>;
export default InputField;
