import type { ReactNode } from "react";

import "./AuthFormField.scss";

type AuthFormFieldProps = {
  children: ReactNode;
  error?: string;
  inputId: string;
  label: string;
};

export function AuthFormField({ children, error = "", inputId, label }: AuthFormFieldProps) {
  return (
    <div className="auth-form-field">
      <label htmlFor={inputId}>{label}</label>
      {children}
      <p aria-live="polite" className="auth-form-field__error" id={`${inputId}-error`}>
        {error}
      </p>
    </div>
  );
}
