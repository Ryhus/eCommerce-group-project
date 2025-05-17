import React from "react";
import "./inputField.scss";

type InputFieldProps = {
  value: string; // The input's value
  onChange: (newValue: string) => void; // Function to call when text changes
  placeholder?: string; // Optional placeholder text
  disabled?: boolean; // Disable interaction
  isValid?: boolean; // Mark input as invalid
  className?: string;
}; // to do: add optional icon

const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  placeholder = "",
  disabled = false, // Default to enabled
  isValid = true, // Default to valid
  className = "",
}) => {
  const errorClass = isValid ? "" : "input--error";
  const inputClass = `input ${errorClass} ${className}`.trim();
  return (
    <input
      className={inputClass}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={!isValid}
    />
  );
};

// Export the InputField component for use elsewhere
export default InputField;
