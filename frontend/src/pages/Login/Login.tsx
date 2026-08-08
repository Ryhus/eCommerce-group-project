import { type FormEvent, useRef, useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import { AuthLayout } from "../../components/Auth/AuthLayout/AuthLayout";
import { PasswordVisibilityButton } from "../../components/common/PasswordVisibilityButton/PasswordVisibilityButton";
import Button from "../../components/common/button/button";
import InputField from "../../components/common/inputField/inputField";
import { useCart } from "../../components/context/useCart";
import { useAuth } from "../../components/context/useAuth";
import { signIn } from "../../services/customerService/customerService";
import { getEmailValidationErrorCode, type EmailValidationErrorCode } from "../../utils/validation";

import "./Login.scss";

export default function LoginPage() {
  const { t } = useTranslation("common");
  const { refreshUser } = useAuth();

  const navigate = useNavigate();
  const { setNewCart } = useCart();
  const [hasAuthError, setHasAuthError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState<EmailValidationErrorCode | null>(null);
  const [hasPasswordError, setHasPasswordError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) validateEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (hasPasswordError) validatePassword(value);
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      if (!isEmailValid) emailInputRef.current?.focus();
      else passwordInputRef.current?.focus();
      return;
    }

    try {
      setHasAuthError(false);
      setIsSubmitting(true);
      const loginData = await signIn(email, password);
      setNewCart(loginData.cart);
      await refreshUser();
      navigate("/");
    } catch {
      setHasAuthError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateEmail = (value: string) => {
    const error = getEmailValidationErrorCode(value);
    setEmailError(error);
    return !error;
  };

  const validatePassword = (value: string) => {
    const isValid = Boolean(value);
    setHasPasswordError(!isValid);
    return isValid;
  };

  return (
    <AuthLayout>
      <form aria-label={t("login.form")} className="login-form" noValidate onSubmit={handleLogin}>
        <header className="login-form__header">
          <h1>{t("login.title")}</h1>
          <p>{t("login.description")}</p>
        </header>

        <div className="login-form__fields">
          <div className="login-form__field">
            <label htmlFor="login-email">{t("login.emailLabel")}</label>
            <InputField
              aria-describedby={emailError ? "login-email-error" : undefined}
              autoComplete="email"
              icon={<FaEnvelope />}
              id="login-email"
              inputMode="email"
              inputRef={emailInputRef}
              isValid={!emailError}
              name="email"
              onBlur={() => validateEmail(email)}
              onChange={handleEmailChange}
              placeholder={t("login.emailPlaceholder")}
              type="email"
              value={email}
            />
            <p aria-live="polite" className="login-form__error" id="login-email-error">
              {emailError ? t(`emailValidation.${emailError}`) : ""}
            </p>
          </div>

          <div className="login-form__field">
            <label htmlFor="login-password">{t("login.passwordLabel")}</label>
            <InputField
              aria-describedby={hasPasswordError ? "login-password-error" : undefined}
              autoComplete="current-password"
              icon={<FaLock />}
              id="login-password"
              inputRef={passwordInputRef}
              isValid={!hasPasswordError}
              name="password"
              onBlur={() => validatePassword(password)}
              onChange={handlePasswordChange}
              placeholder={t("login.passwordPlaceholder")}
              rightIcon={
                <PasswordVisibilityButton
                  isVisible={showPassword}
                  onToggle={() => setShowPassword((isVisible) => !isVisible)}
                />
              }
              type={showPassword ? "text" : "password"}
              value={password}
            />
            <p aria-live="polite" className="login-form__error" id="login-password-error">
              {hasPasswordError ? t("login.passwordRequired") : ""}
            </p>
          </div>
        </div>

        {hasAuthError && (
          <p className="login-form__auth-error" role="alert">
            {t("login.authError")}
          </p>
        )}

        <Button
          className="login-form__submit"
          disabled={isSubmitting}
          text={isSubmitting ? t("login.submitting") : t("login.submit")}
          type="submit"
        />

        <p className="login-form__registration">
          <span>{t("login.newCustomer")}</span> <Link to="/sign-up">{t("login.createAccount")}</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
