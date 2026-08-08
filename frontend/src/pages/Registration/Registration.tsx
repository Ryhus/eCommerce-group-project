import { type FormEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthLayout } from "../../components/Auth/AuthLayout/AuthLayout";
import { RegistrationProgress } from "../../components/Auth/RegistrationProgress/RegistrationProgress";
import Button from "../../components/common/button/button";
import { useAuth } from "../../components/context/useAuth";
import { useCart } from "../../components/context/useCart";
import { signUp } from "../../services/customerService/customerService";
import {
  RegistrationAccountStep,
  RegistrationAddressStep,
  RegistrationPersonalStep,
  type RegistrationUpdate,
} from "./RegistrationSteps";
import {
  hasRegistrationErrors,
  INITIAL_REGISTRATION_FORM,
  REGISTRATION_FIELD_IDS,
  STEP_FIELDS,
  validateRegistrationStep,
  type RegistrationErrors,
  type RegistrationStep,
} from "./registrationForm";

import "./Registration.scss";

export default function RegistrationPage() {
  const { isAuthenticated, refreshUser } = useAuth();
  const { setNewCart } = useCart();
  const navigate = useNavigate();
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const hasChangedStep = useRef(false);

  const [currentStep, setCurrentStep] = useState<RegistrationStep>(0);
  const [data, setData] = useState(INITIAL_REGISTRATION_FORM);
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (hasChangedStep.current) stepHeadingRef.current?.focus();
    else hasChangedStep.current = true;
  }, [currentStep]);

  const updateField: RegistrationUpdate = (field, value) => {
    setData((currentData) => ({ ...currentData, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    setAuthError("");
  };

  const validateCurrentStep = () => {
    const stepErrors = validateRegistrationStep(currentStep, data);
    setErrors(stepErrors);

    if (!hasRegistrationErrors(stepErrors)) return true;

    const firstInvalidField = STEP_FIELDS[currentStep].find((field) => stepErrors[field]);
    if (firstInvalidField) {
      requestAnimationFrame(() => document.getElementById(REGISTRATION_FIELD_IDS[firstInvalidField])?.focus());
    }
    return false;
  };

  const goBack = () => {
    if (currentStep === 0) return;
    setErrors({});
    setAuthError("");
    setCurrentStep((currentStep - 1) as RegistrationStep);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateCurrentStep()) return;

    if (currentStep < 2) {
      setErrors({});
      setCurrentStep((currentStep + 1) as RegistrationStep);
      return;
    }

    try {
      setAuthError("");
      setIsSubmitting(true);
      const customer = await signUp(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
        data.dateOfBirth,
        [{ streetName: data.street, city: data.city, postalCode: data.postalCode, country: data.country }],
        data.useAsDefaultAddress
      );
      setNewCart(customer.cart);
      await refreshUser();
      navigate("/");
    } catch {
      setAuthError("We couldn't create your account. Please review your details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <form
        aria-label="Create your Sport Gear account"
        className="registration-form"
        noValidate
        onSubmit={handleSubmit}
      >
        <header className="registration-form__header">
          <p className="registration-form__step-count">Step {currentStep + 1} of 3</p>
          <h1 ref={stepHeadingRef} tabIndex={-1}>
            Create your account
          </h1>
          <p>Join Sport Gear in three quick steps.</p>
        </header>

        <RegistrationProgress currentStep={currentStep} />

        {currentStep === 0 && (
          <RegistrationAccountStep
            confirmPasswordVisible={confirmPasswordVisible}
            data={data}
            errors={errors}
            onChange={updateField}
            onToggleConfirmPassword={() => setConfirmPasswordVisible((isVisible) => !isVisible)}
            onTogglePassword={() => setPasswordVisible((isVisible) => !isVisible)}
            passwordVisible={passwordVisible}
          />
        )}
        {currentStep === 1 && <RegistrationPersonalStep data={data} errors={errors} onChange={updateField} />}
        {currentStep === 2 && <RegistrationAddressStep data={data} errors={errors} onChange={updateField} />}

        <div className="registration-form__server-error">{authError && <p role="alert">{authError}</p>}</div>

        <div className="registration-form__actions">
          {currentStep > 0 && <Button disabled={isSubmitting} onClick={goBack} text="Back" variant="light" />}
          <Button
            disabled={isSubmitting}
            text={currentStep === 2 ? (isSubmitting ? "Creating account…" : "Create account") : "Continue"}
            type="submit"
          />
        </div>

        <p className="registration-form__login-link">
          <span>Already have an account?</span> <Link to="/login">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
