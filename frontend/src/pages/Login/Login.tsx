import { type FormEvent, useEffect, useRef, useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import { AuthLayout } from "../../components/Auth/AuthLayout/AuthLayout";
import { PasswordVisibilityButton } from "../../components/common/PasswordVisibilityButton/PasswordVisibilityButton";
import Button from "../../components/common/button/button";
import InputField from "../../components/common/inputField/inputField";
import { useCart } from "../../components/context/useCart";
import { useAuth } from "../../components/context/useAuth";
import { signIn } from "../../services/customerService/customerService";
import { validateEmailFormat } from "../../utils/validation";

import "./Login.scss";

export default function LoginPage() {
  const { isAuthenticated, refreshUser } = useAuth();

  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const { setNewCart } = useCart();
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) validateEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) validatePassword(value);
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
      setAuthError("");
      setIsSubmitting(true);
      const loginData = await signIn(email, password);
      setNewCart(loginData.cart);
      await refreshUser();
      navigate("/");
    } catch {
      setAuthError("Wrong email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateEmail = (value: string) => {
    const error = validateEmailFormat(value);
    setEmailError(error || "");
    return !error;
  };

  const validatePassword = (value: string) => {
    const error = value ? "" : "Enter your password.";
    setPasswordError(error);
    return !error;
  };

  return (
    <AuthLayout>
      <form aria-label="Login" className="login-form" noValidate onSubmit={handleLogin}>
        <header className="login-form__header">
          <h1>Welcome back</h1>
          <p>Sign in to continue your journey.</p>
        </header>

        <div className="login-form__fields">
          <div className="login-form__field">
            <label htmlFor="login-email">Email address</label>
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
              placeholder="you@example.com"
              type="email"
              value={email}
            />
            <p aria-live="polite" className="login-form__error" id="login-email-error">
              {emailError}
            </p>
          </div>

          <div className="login-form__field">
            <label htmlFor="login-password">Password</label>
            <InputField
              aria-describedby={passwordError ? "login-password-error" : undefined}
              autoComplete="current-password"
              icon={<FaLock />}
              id="login-password"
              inputRef={passwordInputRef}
              isValid={!passwordError}
              name="password"
              onBlur={() => validatePassword(password)}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
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
              {passwordError}
            </p>
          </div>
        </div>

        {authError && (
          <p className="login-form__auth-error" role="alert">
            {authError}
          </p>
        )}

        <Button
          className="login-form__submit"
          disabled={isSubmitting}
          text={isSubmitting ? "Logging in…" : "Log in"}
          type="submit"
        />

        <p className="login-form__registration">
          <span>New to Sport Gear?</span> <Link to="/sign-up">Create an account</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
