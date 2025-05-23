import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmailFormat, validatePasswordStrength } from "../../utils/validation";
import { FaLock, FaEnvelope, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import Button from "../../components/common/button/button";
import InputField from "../../components/common/inputField/inputField";
// import Link from "../../components/common/link/link";
import Paragraph from "../../components/common/paragraph/paragraph";
import { H2 } from "../../components/common/headings/H2";
import "./Registration.scss";

export default function RegistrationPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateEmail = (value: string) => {
    const isValid = validateEmailFormat(value);
    setEmailError(isValid ? "" : "Please enter a valid email.");
    return isValid;
  };

  const toggleShowPassword = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  const validatePassword = (value: string) => {
    const error = validatePasswordStrength(value);
    setPasswordError(error || "");
    return !error;
  };

  const validateConfirmPassword = (value: string) => {
    const isValid = value === password;
    setConfirmPasswordError(isValid ? "" : "Passwords do not match.");
    return isValid;
  };

  const handleRegister = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(confirmPassword);

    if (!isEmailValid || !isPasswordValid || !isConfirmValid) return;

    console.log("Registering:", { firstName, lastName, email, password });
  };

  const navigate = useNavigate();

  return (
    <div className="registration-wrapper">
      <H2 text="Sign up" />

      <div className="field-group">
        <Paragraph text="First name" />
        <InputField value={firstName} onChange={setFirstName} placeholder="John" icon={<FaUser />} />
      </div>

      <div className="field-group">
        <Paragraph text="Last name" />
        <InputField value={lastName} onChange={setLastName} placeholder="Doe" icon={<FaUser />} />
      </div>

      <div className="field-group">
        <Paragraph text="Email address" className="required" />
        <InputField
          value={email}
          onChange={(v) => {
            setEmail(v);
            if (emailError) validateEmail(v);
          }}
          isValid={!emailError}
          placeholder="you@example.com"
          icon={<FaEnvelope />}
        />
        {emailError && <Paragraph text={emailError} isError />}
      </div>

      <div className="field-group">
        <Paragraph text="Password" className="required" />
        <InputField
          value={password}
          onChange={(v) => {
            setPassword(v);
            if (passwordError) validatePassword(v);
          }}
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
        {passwordError && <Paragraph text={passwordError} isError />}
      </div>

      <div className="field-group">
        <Paragraph text="Confirm password" className="required" />
        <InputField
          value={confirmPassword}
          onChange={(v) => {
            setConfirmPassword(v);
            if (confirmPasswordError) validateConfirmPassword(v);
          }}
          isValid={!confirmPasswordError}
          placeholder="Re-enter your password"
          type={showPassword ? "text" : "password"}
          icon={<FaLock />}
          rightIcon={
            <span onClick={toggleShowPassword} style={{ cursor: "pointer" }}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          }
        />
        {confirmPasswordError && <Paragraph text={confirmPasswordError} isError />}
      </div>

      <Button className="register-btn" text="Sign up" onClick={handleRegister} />

      <p className="login-link" onClick={() => navigate("/login")}>
        Already have an account? <span>Log in</span>
      </p>
    </div>
  );
}
