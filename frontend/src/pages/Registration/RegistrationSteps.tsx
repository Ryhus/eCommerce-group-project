import { FaCalendar, FaEnvelope, FaLock, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";

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
import { getRegistrationErrorKey } from "./registrationForm";

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
  const { t } = useTranslation("common");

  return (
    <div className="registration-form__step registration-form__step--account">
      <div className="registration-form__name-fields">
        <AuthFormField
          error={t(getRegistrationErrorKey(errors.firstName) as never)}
          inputId={REGISTRATION_FIELD_IDS.firstName}
          label={t("registration.firstName")}
        >
          <InputField
            aria-describedby={describedBy("firstName")}
            autoComplete="given-name"
            icon={<FaUser />}
            id={REGISTRATION_FIELD_IDS.firstName}
            isValid={!errors.firstName}
            name="firstName"
            onChange={(value) => onChange("firstName", value)}
            placeholder={t("registration.firstNamePlaceholder")}
            value={data.firstName}
          />
        </AuthFormField>

        <AuthFormField
          error={t(getRegistrationErrorKey(errors.lastName) as never)}
          inputId={REGISTRATION_FIELD_IDS.lastName}
          label={t("registration.lastName")}
        >
          <InputField
            aria-describedby={describedBy("lastName")}
            autoComplete="family-name"
            icon={<FaUser />}
            id={REGISTRATION_FIELD_IDS.lastName}
            isValid={!errors.lastName}
            name="lastName"
            onChange={(value) => onChange("lastName", value)}
            placeholder={t("registration.lastNamePlaceholder")}
            value={data.lastName}
          />
        </AuthFormField>
      </div>

      <AuthFormField
        error={t(getRegistrationErrorKey(errors.email) as never)}
        inputId={REGISTRATION_FIELD_IDS.email}
        label={t("registration.email")}
      >
        <InputField
          aria-describedby={describedBy("email")}
          autoComplete="email"
          icon={<FaEnvelope />}
          id={REGISTRATION_FIELD_IDS.email}
          inputMode="email"
          isValid={!errors.email}
          name="email"
          onChange={(value) => onChange("email", value)}
          placeholder={t("registration.emailPlaceholder")}
          type="email"
          value={data.email}
        />
      </AuthFormField>

      <AuthFormField
        error={t(getRegistrationErrorKey(errors.password) as never)}
        inputId={REGISTRATION_FIELD_IDS.password}
        label={t("registration.password")}
      >
        <InputField
          aria-describedby={`${describedBy("password")} registration-password-help`}
          autoComplete="new-password"
          icon={<FaLock />}
          id={REGISTRATION_FIELD_IDS.password}
          isValid={!errors.password}
          name="password"
          onChange={(value) => onChange("password", value)}
          placeholder={t("registration.passwordPlaceholder")}
          rightIcon={<PasswordVisibilityButton isVisible={passwordVisible} onToggle={onTogglePassword} />}
          type={passwordVisible ? "text" : "password"}
          value={data.password}
        />
        <p className="registration-form__help" id="registration-password-help">
          {t("registration.passwordHelp")}
        </p>
      </AuthFormField>

      <AuthFormField
        error={t(getRegistrationErrorKey(errors.confirmPassword) as never)}
        inputId={REGISTRATION_FIELD_IDS.confirmPassword}
        label={t("registration.confirmPassword")}
      >
        <InputField
          aria-describedby={describedBy("confirmPassword")}
          autoComplete="new-password"
          icon={<FaLock />}
          id={REGISTRATION_FIELD_IDS.confirmPassword}
          isValid={!errors.confirmPassword}
          name="confirmPassword"
          onChange={(value) => onChange("confirmPassword", value)}
          placeholder={t("registration.confirmPasswordPlaceholder")}
          rightIcon={<PasswordVisibilityButton isVisible={confirmPasswordVisible} onToggle={onToggleConfirmPassword} />}
          type={confirmPasswordVisible ? "text" : "password"}
          value={data.confirmPassword}
        />
      </AuthFormField>
    </div>
  );
}

export function RegistrationPersonalStep({ data, errors, onChange }: RegistrationStepProps) {
  const { t } = useTranslation("common");
  return (
    <div className="registration-form__step registration-form__step--personal">
      <div className="registration-form__step-intro">
        <h2>{t("registration.personalTitle")}</h2>
        <p>{t("registration.personalDescription")}</p>
      </div>

      <AuthFormField
        error={t(getRegistrationErrorKey(errors.dateOfBirth) as never)}
        inputId={REGISTRATION_FIELD_IDS.dateOfBirth}
        label={t("registration.dateOfBirth")}
      >
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
  const { t, i18n } = useTranslation("common");
  const countryLocale = i18n.resolvedLanguage ?? i18n.language;
  const countryNames = new Intl.DisplayNames([countryLocale], { type: "region" });

  return (
    <div className="registration-form__step registration-form__step--address">
      <div className="registration-form__step-intro">
        <h2>{t("registration.addressTitle")}</h2>
        <p>{t("registration.addressDescription")}</p>
      </div>

      <AuthFormField
        error={t(getRegistrationErrorKey(errors.street) as never)}
        inputId={REGISTRATION_FIELD_IDS.street}
        label={t("registration.street")}
      >
        <InputField
          aria-describedby={describedBy("street")}
          autoComplete="street-address"
          icon={<FaMapMarkerAlt />}
          id={REGISTRATION_FIELD_IDS.street}
          isValid={!errors.street}
          name="street"
          onChange={(value) => onChange("street", value)}
          placeholder={t("registration.streetPlaceholder")}
          value={data.street}
        />
      </AuthFormField>

      <div className="registration-form__address-row">
        <AuthFormField
          error={t(getRegistrationErrorKey(errors.city) as never)}
          inputId={REGISTRATION_FIELD_IDS.city}
          label={t("registration.city")}
        >
          <InputField
            aria-describedby={describedBy("city")}
            autoComplete="address-level2"
            id={REGISTRATION_FIELD_IDS.city}
            isValid={!errors.city}
            name="city"
            onChange={(value) => onChange("city", value)}
            placeholder={t("registration.cityPlaceholder")}
            value={data.city}
          />
        </AuthFormField>

        <AuthFormField
          error={t(getRegistrationErrorKey(errors.postalCode) as never)}
          inputId={REGISTRATION_FIELD_IDS.postalCode}
          label={t("registration.postalCode")}
        >
          <InputField
            aria-describedby={describedBy("postalCode")}
            autoComplete="postal-code"
            id={REGISTRATION_FIELD_IDS.postalCode}
            isValid={!errors.postalCode}
            name="postalCode"
            onChange={(value) => onChange("postalCode", value)}
            placeholder={t("registration.postalCodePlaceholder")}
            value={data.postalCode}
          />
        </AuthFormField>
      </div>

      <AuthFormField
        error={t(getRegistrationErrorKey(errors.country) as never)}
        inputId={REGISTRATION_FIELD_IDS.country}
        label={t("registration.country")}
      >
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
              {value ? (countryNames.of(value) ?? label) : t("registration.countryPlaceholder")}
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
        <span>{t("registration.defaultAddress")}</span>
      </label>
    </div>
  );
}
