import { type FormEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router-dom";

import type { CustomerResponse } from "../../../services/customerService/types";
import { getRegistrationErrorKey } from "../../../pages/Registration/registrationForm";
import { validatePasswordStrength } from "../../../utils/validation";
import { AuthFormField } from "../../Auth/AuthFormField/AuthFormField";
import { PasswordVisibilityButton } from "../../common/PasswordVisibilityButton/PasswordVisibilityButton";
import Button from "../../common/button/button";
import InputField from "../../common/inputField/inputField";

import "./ProfilePasswordForm.scss";

type ProfilePasswordFormProps = {
  onCancel: () => void;
  onSuccess: () => void;
};

type PasswordErrors = Partial<Record<"currentPassword" | "newPassword", string>>;
type ProfileActionData = CustomerResponse | { message?: string; statusCode?: number };

const CURRENT_PASSWORD_ID = "profile-current-password";
const NEW_PASSWORD_ID = "profile-new-password";

function isSuccessfulPasswordAction(data: ProfileActionData | undefined): data is CustomerResponse {
  return Boolean(data && "id" in data);
}

export function ProfilePasswordForm({ onCancel, onSuccess }: ProfilePasswordFormProps) {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<ProfileActionData>();
  const submitted = useRef(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);

  const isSubmitting = fetcher.state !== "idle";
  const serverError =
    fetcher.data && !isSuccessfulPasswordAction(fetcher.data)
      ? fetcher.data.message || t("profile.unableToChangePassword")
      : "";

  useEffect(() => {
    if (submitted.current && fetcher.state === "idle" && isSuccessfulPasswordAction(fetcher.data)) {
      submitted.current = false;
      onSuccess();
    }
  }, [fetcher.data, fetcher.state, onSuccess]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const nextErrors: PasswordErrors = {
      currentPassword: currentPassword ? undefined : t("profile.currentPasswordRequired"),
      newPassword: getTranslatedError(validatePasswordStrength(newPassword)),
    };
    setErrors(nextErrors);

    const firstInvalidId = nextErrors.currentPassword
      ? CURRENT_PASSWORD_ID
      : nextErrors.newPassword
        ? NEW_PASSWORD_ID
        : null;
    if (firstInvalidId) {
      event.preventDefault();
      requestAnimationFrame(() => document.getElementById(firstInvalidId)?.focus());
      return;
    }

    submitted.current = true;
  };

  function getTranslatedError(error: string | null) {
    return error ? t(getRegistrationErrorKey(error) as never) : undefined;
  }

  return (
    <fetcher.Form className="profile-password-form" method="post" noValidate onSubmit={handleSubmit}>
      <input name="actionType" type="hidden" value="changePassword" />

      <AuthFormField error={errors.currentPassword} inputId={CURRENT_PASSWORD_ID} label={t("profile.currentPassword")}>
        <InputField
          aria-describedby={`${CURRENT_PASSWORD_ID}-error`}
          autoComplete="current-password"
          id={CURRENT_PASSWORD_ID}
          isValid={!errors.currentPassword}
          name="currentPassword"
          onChange={(value) => {
            setCurrentPassword(value);
            setErrors((current) => ({ ...current, currentPassword: undefined }));
          }}
          rightIcon={
            <PasswordVisibilityButton
              isVisible={currentPasswordVisible}
              onToggle={() => setCurrentPasswordVisible((visible) => !visible)}
            />
          }
          type={currentPasswordVisible ? "text" : "password"}
          value={currentPassword}
        />
      </AuthFormField>

      <AuthFormField error={errors.newPassword} inputId={NEW_PASSWORD_ID} label={t("profile.newPassword")}>
        <InputField
          aria-describedby={`${NEW_PASSWORD_ID}-error profile-new-password-help`}
          autoComplete="new-password"
          id={NEW_PASSWORD_ID}
          isValid={!errors.newPassword}
          name="newPassword"
          onChange={(value) => {
            setNewPassword(value);
            setErrors((current) => ({ ...current, newPassword: undefined }));
          }}
          rightIcon={
            <PasswordVisibilityButton
              isVisible={newPasswordVisible}
              onToggle={() => setNewPasswordVisible((visible) => !visible)}
            />
          }
          type={newPasswordVisible ? "text" : "password"}
          value={newPassword}
        />
        <p className="profile-password-form__help" id="profile-new-password-help">
          {t("profile.newPasswordHelp")}
        </p>
      </AuthFormField>

      <div className="profile-password-form__server-error" aria-live="polite">
        {serverError && <p>{serverError}</p>}
      </div>

      <div className="profile-password-form__actions">
        <Button disabled={isSubmitting} onClick={onCancel} text={t("profile.cancel")} variant="light" />
        <Button
          disabled={isSubmitting}
          text={isSubmitting ? t("profile.changingPassword") : t("profile.changePassword")}
          type="submit"
        />
      </div>
    </fetcher.Form>
  );
}
