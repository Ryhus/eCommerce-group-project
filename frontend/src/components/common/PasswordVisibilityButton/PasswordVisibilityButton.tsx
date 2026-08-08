import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import "./PasswordVisibilityButton.scss";

type PasswordVisibilityButtonProps = {
  isVisible: boolean;
  onToggle: () => void;
};

export function PasswordVisibilityButton({ isVisible, onToggle }: PasswordVisibilityButtonProps) {
  const { t } = useTranslation("common");
  const label = isVisible ? t("passwordVisibility.hide") : t("passwordVisibility.show");

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
