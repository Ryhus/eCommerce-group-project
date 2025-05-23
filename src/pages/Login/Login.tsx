import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../../components/common/button/button";
import InputField from "../../components/common/inputField/inputField";
// import Link from "../../components/common/link/link";
import Paragraph from "../../components/common/paragraph/paragraph";
import { H2 } from "../../components/common/headings/H2";
import { validateEmailFormat, validatePasswordStrength } from "../../utils/validation";
import "./Login.scss";

export default function LoginPage() {
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

  const handleLogin = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) return;

    console.log("Logging in:", { email, password });
  };

  const validateEmail = (value: string) => {
    const isValid = validateEmailFormat(value);
    setEmailError(isValid ? "" : "Please enter a valid email.");
    return isValid;
  };

  const validatePassword = (value: string) => {
    const error = validatePasswordStrength(value);
    setPasswordError(error || "");
    return !error;
  };

  const navigate = useNavigate();

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

      <p className="registration-link" onClick={() => navigate("/register")}>
        Don’t have an account? <span>Register</span>
      </p>
    </div>
  );
}
