import { FaCalendar, FaEnvelope, FaLock, FaMapMarkerAlt, FaUser } from "react-icons/fa";

import { AuthFormField } from "../../components/Auth/AuthFormField/AuthFormField";
import { PasswordVisibilityButton } from "../../components/common/PasswordVisibilityButton/PasswordVisibilityButton";
import InputField from "../../components/common/inputField/inputField";
import {
  COUNTRY_OPTIONS,
  REGISTRATION_FIELD_IDS,
  type RegistrationErrors,
  type RegistrationField,
  type RegistrationFormData,
} from "./registrationForm";

export type RegistrationUpdate = <Field extends RegistrationField>(
  field: Field,
  value: RegistrationFormData[Field]
) => void;

type RegistrationStepProps = {
  data: RegistrationFormData;
  errors: RegistrationErrors;
  onChange: RegistrationUpdate;
};

type AccountStepProps = RegistrationStepProps & {
  confirmPasswordVisible: boolean;
  onToggleConfirmPassword: () => void;
  onTogglePassword: () => void;
  passwordVisible: boolean;
};

function describedBy(field: RegistrationField) {
  return `${REGISTRATION_FIELD_IDS[field]}-error`;
}

export function RegistrationAccountStep({
  confirmPasswordVisible,
  data,
  errors,
  onChange,
  onToggleConfirmPassword,
  onTogglePassword,
  passwordVisible,
}: AccountStepProps) {
  return (
    <div className="registration-form__step registration-form__step--account">
      <div className="registration-form__name-fields">
        <AuthFormField error={errors.firstName} inputId={REGISTRATION_FIELD_IDS.firstName} label="First name">
          <InputField
            aria-describedby={describedBy("firstName")}
            autoComplete="given-name"
            icon={<FaUser />}
            id={REGISTRATION_FIELD_IDS.firstName}
            isValid={!errors.firstName}
            name="firstName"
            onChange={(value) => onChange("firstName", value)}
            placeholder="John"
            value={data.firstName}
          />
        </AuthFormField>

        <AuthFormField error={errors.lastName} inputId={REGISTRATION_FIELD_IDS.lastName} label="Last name">
          <InputField
            aria-describedby={describedBy("lastName")}
            autoComplete="family-name"
            icon={<FaUser />}
            id={REGISTRATION_FIELD_IDS.lastName}
            isValid={!errors.lastName}
            name="lastName"
            onChange={(value) => onChange("lastName", value)}
            placeholder="Doe"
            value={data.lastName}
          />
        </AuthFormField>
      </div>

      <AuthFormField error={errors.email} inputId={REGISTRATION_FIELD_IDS.email} label="Email address">
        <InputField
          aria-describedby={describedBy("email")}
          autoComplete="email"
          icon={<FaEnvelope />}
          id={REGISTRATION_FIELD_IDS.email}
          inputMode="email"
          isValid={!errors.email}
          name="email"
          onChange={(value) => onChange("email", value)}
          placeholder="you@example.com"
          type="email"
          value={data.email}
        />
      </AuthFormField>

      <AuthFormField error={errors.password} inputId={REGISTRATION_FIELD_IDS.password} label="Password">
        <InputField
          aria-describedby={`${describedBy("password")} registration-password-help`}
          autoComplete="new-password"
          icon={<FaLock />}
          id={REGISTRATION_FIELD_IDS.password}
          isValid={!errors.password}
          name="password"
          onChange={(value) => onChange("password", value)}
          placeholder="Create a password"
          rightIcon={<PasswordVisibilityButton isVisible={passwordVisible} onToggle={onTogglePassword} />}
          type={passwordVisible ? "text" : "password"}
          value={data.password}
        />
        <p className="registration-form__help" id="registration-password-help">
          At least 8 characters with uppercase, lowercase, number and special character.
        </p>
      </AuthFormField>

      <AuthFormField
        error={errors.confirmPassword}
        inputId={REGISTRATION_FIELD_IDS.confirmPassword}
        label="Confirm password"
      >
        <InputField
          aria-describedby={describedBy("confirmPassword")}
          autoComplete="new-password"
          icon={<FaLock />}
          id={REGISTRATION_FIELD_IDS.confirmPassword}
          isValid={!errors.confirmPassword}
          name="confirmPassword"
          onChange={(value) => onChange("confirmPassword", value)}
          placeholder="Repeat your password"
          rightIcon={<PasswordVisibilityButton isVisible={confirmPasswordVisible} onToggle={onToggleConfirmPassword} />}
          type={confirmPasswordVisible ? "text" : "password"}
          value={data.confirmPassword}
        />
      </AuthFormField>
    </div>
  );
}

export function RegistrationPersonalStep({ data, errors, onChange }: RegistrationStepProps) {
  return (
    <div className="registration-form__step registration-form__step--personal">
      <div className="registration-form__step-intro">
        <h2>A little about you</h2>
        <p>We use your date of birth only to confirm that you meet the minimum age requirement.</p>
      </div>

      <AuthFormField error={errors.dateOfBirth} inputId={REGISTRATION_FIELD_IDS.dateOfBirth} label="Date of birth">
        <InputField
          aria-describedby={describedBy("dateOfBirth")}
          autoComplete="bday"
          icon={<FaCalendar />}
          id={REGISTRATION_FIELD_IDS.dateOfBirth}
          isValid={!errors.dateOfBirth}
          name="dateOfBirth"
          onChange={(value) => onChange("dateOfBirth", value)}
          type="date"
          value={data.dateOfBirth}
        />
      </AuthFormField>
    </div>
  );
}

export function RegistrationAddressStep({ data, errors, onChange }: RegistrationStepProps) {
  return (
    <div className="registration-form__step registration-form__step--address">
      <div className="registration-form__step-intro">
        <h2>Your address</h2>
        <p>Add the address you want to use for future deliveries and billing.</p>
      </div>

      <AuthFormField error={errors.street} inputId={REGISTRATION_FIELD_IDS.street} label="Street address">
        <InputField
          aria-describedby={describedBy("street")}
          autoComplete="street-address"
          icon={<FaMapMarkerAlt />}
          id={REGISTRATION_FIELD_IDS.street}
          isValid={!errors.street}
          name="street"
          onChange={(value) => onChange("street", value)}
          placeholder="10 Main Street"
          value={data.street}
        />
      </AuthFormField>

      <div className="registration-form__address-row">
        <AuthFormField error={errors.city} inputId={REGISTRATION_FIELD_IDS.city} label="City">
          <InputField
            aria-describedby={describedBy("city")}
            autoComplete="address-level2"
            id={REGISTRATION_FIELD_IDS.city}
            isValid={!errors.city}
            name="city"
            onChange={(value) => onChange("city", value)}
            placeholder="Berlin"
            value={data.city}
          />
        </AuthFormField>

        <AuthFormField error={errors.postalCode} inputId={REGISTRATION_FIELD_IDS.postalCode} label="Postal code">
          <InputField
            aria-describedby={describedBy("postalCode")}
            autoComplete="postal-code"
            id={REGISTRATION_FIELD_IDS.postalCode}
            isValid={!errors.postalCode}
            name="postalCode"
            onChange={(value) => onChange("postalCode", value)}
            placeholder="10115"
            value={data.postalCode}
          />
        </AuthFormField>
      </div>

      <AuthFormField error={errors.country} inputId={REGISTRATION_FIELD_IDS.country} label="Country">
        <select
          aria-describedby={describedBy("country")}
          aria-invalid={Boolean(errors.country)}
          autoComplete="country"
          className={`input${errors.country ? " input--error" : ""}`}
          id={REGISTRATION_FIELD_IDS.country}
          name="country"
          onChange={(event) => onChange("country", event.currentTarget.value)}
          value={data.country}
        >
          {COUNTRY_OPTIONS.map(([value, label]) => (
            <option key={value || "placeholder"} value={value}>
              {label}
            </option>
          ))}
        </select>
      </AuthFormField>

      <label className="registration-form__default-address">
        <input
          checked={data.useAsDefaultAddress}
          name="useAsDefaultAddress"
          onChange={(event) => onChange("useAsDefaultAddress", event.currentTarget.checked)}
          type="checkbox"
        />
        <span>Use as default billing and shipping address</span>
      </label>
    </div>
  );
}
