import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  validateEmailFormat,
  validatePasswordStrength,
  validateName,
  validateDateOfBirth,
  validateStreet,
  validateCity,
  validatePostalCode,
  validateCountry,
} from "../../utils/validation";
import { FaLock, FaEnvelope, FaEye, FaEyeSlash, FaUser, FaCalendar, FaMapMarkerAlt } from "react-icons/fa";
import Button from "../../components/common/button/button";
import InputField from "../../components/common/inputField/inputField";
import Paragraph from "../../components/common/paragraph/paragraph";
import { H2 } from "../../components/common/headings/H2";
import "./Registration.scss";

export default function RegistrationPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [dobError, setDobError] = useState("");
  const [streetError, setStreetError] = useState("");
  const [cityError, setCityError] = useState("");
  const [postalCodeError, setPostalCodeError] = useState("");
  const countryOptions = [
    { value: "", label: "Select a country" },
    { value: "AT", label: "Austria" },
    { value: "BE", label: "Belgium" },
    { value: "BG", label: "Bulgaria" },
    { value: "HR", label: "Croatia" },
    { value: "CY", label: "Cyprus" },
    { value: "CZ", label: "Czech Republic" },
    { value: "DK", label: "Denmark" },
    { value: "EE", label: "Estonia" },
    { value: "FI", label: "Finland" },
    { value: "FR", label: "France" },
    { value: "DE", label: "Germany" },
    { value: "GR", label: "Greece" },
    { value: "HU", label: "Hungary" },
    { value: "IE", label: "Ireland" },
    { value: "IT", label: "Italy" },
    { value: "LV", label: "Latvia" },
    { value: "LT", label: "Lithuania" },
    { value: "LU", label: "Luxembourg" },
    { value: "MT", label: "Malta" },
    { value: "NL", label: "Netherlands" },
    { value: "PL", label: "Poland" },
    { value: "PT", label: "Portugal" },
    { value: "RO", label: "Romania" },
    { value: "SK", label: "Slovakia" },
    { value: "SI", label: "Slovenia" },
    { value: "ES", label: "Spain" },
    { value: "SE", label: "Sweden" },
  ];

  const [countryError, setCountryError] = useState("");

  const toggleShowPassword = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
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

  const validateConfirmPassword = (value: string) => {
    const isValid = value === password;
    setConfirmPasswordError(isValid ? "" : "Passwords do not match.");
    return isValid;
  };

  const handleRegister = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(confirmPassword);
    const firstNameValid = !validateName(firstName, "First name");
    setFirstNameError(validateName(firstName, "First name") || "");
    const lastNameValid = !validateName(lastName, "Last name");
    setLastNameError(validateName(lastName, "Last name") || "");
    const dobValid = !validateDateOfBirth(dob);
    setDobError(validateDateOfBirth(dob) || "");
    const streetValid = !validateStreet(street);
    setStreetError(validateStreet(street) || "");
    const cityValid = !validateCity(city);
    setCityError(validateCity(city) || "");
    const postalValid = !validatePostalCode(postalCode);
    setPostalCodeError(validatePostalCode(postalCode) || "");
    const countryValid = !validateCountry(country);
    setCountryError(validateCountry(country) || "");

    if (
      isEmailValid &&
      isPasswordValid &&
      isConfirmValid &&
      firstNameValid &&
      lastNameValid &&
      dobValid &&
      streetValid &&
      cityValid &&
      postalValid &&
      countryValid
    ) {
      console.log("Registering:", { firstName, lastName, email, password, dob, street, city, postalCode, country });
    }
  };

  return (
    <div className="registration-wrapper">
      <H2 text="Sign up" />

      <div className="field-group">
        <Paragraph text="First name" />
        <InputField
          value={firstName}
          onChange={(v) => {
            setFirstName(v);
            if (firstNameError) setFirstNameError(validateName(v, "First name") || "");
          }}
          isValid={!firstNameError}
          placeholder="John"
          icon={<FaUser />}
        />
        {firstNameError && <Paragraph text={firstNameError} isError />}
      </div>

      <div className="field-group">
        <Paragraph text="Last name" />
        <InputField
          value={lastName}
          onChange={(v) => {
            setLastName(v);
            if (lastNameError) setLastNameError(validateName(v, "Last name") || "");
          }}
          isValid={!lastNameError}
          placeholder="Doe"
          icon={<FaUser />}
        />
        {lastNameError && <Paragraph text={lastNameError} isError />}
      </div>

      <div className="field-group">
        <Paragraph text="Email address" />
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
        <Paragraph text="Password" />
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
        <Paragraph text="Confirm password" />
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

      <div className="field-group">
        <Paragraph text="Date of birth" />
        <InputField
          value={dob}
          onChange={(v) => {
            setDob(v);
            if (dobError) setDobError(validateDateOfBirth(v) || "");
          }}
          isValid={!dobError}
          placeholder="YYYY-MM-DD"
          type="date"
          icon={<FaCalendar />}
        />
        {dobError && <Paragraph text={dobError} isError />}
      </div>

      <div className="field-group">
        <Paragraph text="Street" />
        <InputField
          value={street}
          onChange={(v) => {
            setStreet(v);
            if (streetError) setStreetError(validateStreet(v) || "");
          }}
          isValid={!streetError}
          placeholder="Enter street address"
          icon={<FaMapMarkerAlt />}
        />
        {streetError && <Paragraph text={streetError} isError />}
      </div>

      <div className="field-group">
        <Paragraph text="City" />
        <InputField
          value={city}
          onChange={(v) => {
            setCity(v);
            if (cityError) setCityError(validateCity(v) || "");
          }}
          isValid={!cityError}
          placeholder="Brussels"
          icon={<FaMapMarkerAlt />}
        />
        {cityError && <Paragraph text={cityError} isError />}
      </div>

      <div className="field-group">
        <Paragraph text="Postal code" />
        <InputField
          value={postalCode}
          onChange={(v) => {
            setPostalCode(v);
            if (postalCodeError) setPostalCodeError(validatePostalCode(v) || "");
          }}
          isValid={!postalCodeError}
          placeholder="Enter postal code (4–5 digits)"
          icon={<FaMapMarkerAlt />}
        />
        {postalCodeError && <Paragraph text={postalCodeError} isError />}
      </div>

      <div className="field-group">
        <Paragraph text="Country" />
        <select
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            if (countryError) setCountryError(validateCountry(e.target.value) || "");
          }}
          className={`input ${!countryError ? "" : "input--error"}`}
        >
          {countryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {countryError && <Paragraph text={countryError} isError />}
      </div>

      <Button className="register-btn" text="Sign up" onClick={handleRegister} />

      <p className="login-link" onClick={() => navigate("/login")}>
        Already have an account? <span>Log in</span>
      </p>
    </div>
  );
}
