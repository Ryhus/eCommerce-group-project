import { FaEye, FaEyeSlash } from "react-icons/fa";

import "./PasswordVisibilityButton.scss";

type PasswordVisibilityButtonProps = {
  isVisible: boolean;
  onToggle: () => void;
};

export function PasswordVisibilityButton({ isVisible, onToggle }: PasswordVisibilityButtonProps) {
  const label = isVisible ? "Hide password" : "Show password";

  return (
    <button
      aria-label={label}
      aria-pressed={isVisible}
      className="password-visibility-button"
      onClick={onToggle}
      title={label}
      type="button"
    >
      {isVisible ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
    </button>
  );
}
