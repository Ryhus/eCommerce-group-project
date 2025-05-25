import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../../components/common/button/button";
import InputField from "../../components/common/inputField/inputField";
import Paragraph from "../../components/common/paragraph/paragraph";
import Link from "../../components/common/link/link";
import { H2 } from "../../components/common/headings/H2";
import { validateEmailFormat } from "../../utils/validation";
import { AuthService } from "../../services/AuthService";
import { signIn } from "../../services/customerService/customerService";
import { TokenService } from "../../services/TokenService";
import "./Login.scss";

export default function LoginPage() {
  const isLoggedIn = TokenService.getAccessToken();

  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const [authError, setAuthError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

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
    const isValid = validateEmailFormat(value);
    setEmailError(isValid ? "" : "Please enter a valid email.");
    return isValid;
  };

  const validatePassword = (value: string) => {
    const isValid = value.trim() !== "";
    setPasswordError(isValid ? "" : "A password or email are not valid. Please enter valid credentials.");
    return isValid;
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
        </div>
        <InputField
          value={password}
          onChange={handlePasswordChange}
          isValid={!passwordError}
          placeholder="Enter your password"
          type={showPassword ? "text" : "password"}
          icon={<FaLock />}
          rightIcon={
            <span onClick={toggleShowPassword} style={{ cursor: "pointer" }}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          }
        />
        {passwordError && <Paragraph text={passwordError} isError className="email-error-msg" />}
      </div>

      <Button className="login-btn" text="Log in" onClick={handleLogin} />
      {authError && <Paragraph text={authError} isError className="auth-error-msg" />}

      {/* <p className="registration-link" onClick={() => navigate("/sign-up")}>
        Don’t have an account? <span>Sign up</span>
      </p> */}

      <Link
        className="registration-link"
        text="Don’t have an account? Sign up"
        onClick={() => navigate("/sign-up")}
        href={""}
      />
    </div>
  );
}
