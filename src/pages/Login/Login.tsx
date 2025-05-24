import { useState, useEffect } from "react";
import Button from "../../components/common/button/button";
import InputField from "../../components/common/inputField/inputField";
import Link from "../../components/common/link/link";
import Paragraph from "../../components/common/paragraph/paragraph";
import { H2 } from "../../components/common/headings/H2";
import "./Login.scss";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { AuthService } from "../../services/AuthService";
import { signIn } from "../../services/customerService/customerService";
import { useNavigate } from "react-router-dom";
import { TokenService } from "../../services/TokenService";

export default function LoginPage() {
  const isLoggedIn = TokenService.getAccessToken();

  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [authError, setAuthError] = useState("");

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) validateEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) validatePassword(value);
  };

  const toggleShowPassword = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) return;
    console.log("Logging in:", { email, password });

    try {
      setAuthError("");
      const userAuthData = await AuthService.authenticate(email, password);
      const customerData = await signIn(email, password);
      navigate("/");
      console.log("User logged in:", userAuthData);
      console.log("User data:", customerData);
    } catch {
      setAuthError("Wrong email or password. Pls try again");
    }
  };

  const validateEmail = (value: string) => {
    const isValid = /\S+@\S+\.\S+/.test(value);
    setEmailError(isValid ? "" : "Please enter a valid email.");
    return isValid;
  };

  const validatePassword = (value: string) => {
    const isValidLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasDigit = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasOnlyValidChars = /^[A-Za-z0-9!@#$%^&*(),.?":{}|<>]+$/.test(value);

    if (!isValidLength) {
      setPasswordError("Password must be at least 8 characters.");
      return false;
    }
    if (!hasUpperCase) {
      setPasswordError("Password must include at least one uppercase letter.");
      return false;
    }
    if (!hasDigit) {
      setPasswordError("Password must include at least one digit.");
      return false;
    }
    if (!hasSpecialChar) {
      setPasswordError("Password must include at least one special character.");
      return false;
    }
    if (!hasOnlyValidChars) {
      setPasswordError("Password contains invalid characters.");
      return false;
    }

    setPasswordError("");
    return true;
  };

  return (
    <div className="login-wrapper">
      <H2 text="Login" />

      <div className="field-group">
        <Paragraph text="Enter your email address." />
        <InputField
          value={email}
          onChange={handleEmailChange}
          isValid={!emailError}
          placeholder="you@example.com"
          icon={<FaEnvelope />}
        />
        {emailError && <Paragraph text={emailError} isError className="email-error-msg" />}
      </div>

      <div className="field-group">
        <div className="password-label">
          <Paragraph text="Enter your password." />
          <Link text={showPassword ? "Hide password" : "Show password"} href="#" onClick={toggleShowPassword} />
        </div>
        <InputField
          value={password}
          onChange={handlePasswordChange}
          isValid={!passwordError}
          placeholder="Enter your password"
          type={showPassword ? "text" : "password"}
          icon={<FaLock />}
        />
        {passwordError && <Paragraph text={passwordError} isError className="email-error-msg" />}
      </div>

      <Button
        className="login-btn"
        text="Log in"
        onClick={handleLogin}
        // disabled={!email || !password || !!emailError || !!passwordError}
      />
      {authError && <Paragraph text={authError} isError className="auth-error-msg" />}

      <Link
        text="Don't have an account? Register"
        href="/register"
        onClick={(e) => {
          e.preventDefault();
          navigate("/register");
        }}
        className="registration-link"
      />
    </div>
  );
}
