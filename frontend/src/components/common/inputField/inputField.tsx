import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";

import "./inputField.scss";

type InputFieldProps = Omit<ComponentPropsWithoutRef<"input">, "children" | "className" | "onChange" | "value"> & {
  value: string;
  onChange: (newValue: string) => void;
  isValid?: boolean;
  wrapperClassName?: string;
  inputClassName?: string;
  inputRef?: Ref<HTMLInputElement>;
  icon?: ReactNode;
  rightIcon?: ReactNode;
};

const InputField = ({
  value,
  onChange,
  placeholder = "",
  name = "",
  disabled = false,
  isValid = true,
  wrapperClassName = "",
  inputClassName = "",
  inputRef,
  type = "text",
  icon,
  rightIcon,
  ...props
}: InputFieldProps) => {
  const errorClass = isValid ? "" : "input--error";
  const inputClass = `input ${errorClass} ${inputClassName}`.trim();
  const wrapperClass = [
    "input-wrapper",
    icon && "input-wrapper--with-leading-icon",
    rightIcon && "input-wrapper--with-trailing-icon",
    !isValid && "input-wrapper--error",
    wrapperClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass}>
      {icon && (
        <span aria-hidden="true" className="input-icon">
          {icon}
        </span>
      )}
      <input
        {...props}
        ref={inputRef}
        className={inputClass}
        type={type}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder={placeholder}
        name={name}
        disabled={disabled}
        aria-invalid={!isValid}
      />
      {rightIcon && <span className="input-right-icon">{rightIcon}</span>}
    </div>
  );
};

export default InputField;
