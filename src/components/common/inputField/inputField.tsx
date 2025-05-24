import React from "react";
import "./inputField.scss";

type InputFieldProps = {
  value: string; // The input's value
  onChange: (newValue: string) => void; // Function to call when text changes
  placeholder?: string; // Optional placeholder text
  disabled?: boolean; // Disable interaction
  isValid?: boolean; // Mark input as invalid
  wrapperClassName?: string;
  inputClassName?: string;
  type?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  placeholder = "",
  disabled = false, // Default to enabled
  isValid = true, // Default to valid
  wrapperClassName = "",
  inputClassName = "",
  type = "text",
  icon,
  rightIcon,
}) => {
  const errorClass = isValid ? "" : "input--error";
  const inputClass = `input ${errorClass} ${inputClassName}`.trim();
  const wrapperClass = `input-wrapper ${wrapperClassName}`.trim();

  return (
    <div className={wrapperClass}>
      {icon && <span className="input-icon">{icon}</span>}
      <input
        className={inputClass}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!isValid}
      />
      {rightIcon && <span className="input-right-icon">{rightIcon}</span>}
    </div>
  );
};

// Export the InputField component for use elsewhere
export default InputField;
