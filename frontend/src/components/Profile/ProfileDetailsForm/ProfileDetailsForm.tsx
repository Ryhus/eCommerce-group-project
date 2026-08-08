import { type FormEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router-dom";

import type { CustomerResponse } from "../../../services/customerService/types";
import { getRegistrationErrorKey } from "../../../pages/Registration/registrationForm";
import { validateDateOfBirth, validateEmailFormat, validateName } from "../../../utils/validation";
import { AuthFormField } from "../../Auth/AuthFormField/AuthFormField";
import Button from "../../common/button/button";
import InputField from "../../common/inputField/inputField";

import "./ProfileDetailsForm.scss";

type ProfileDetailsFormProps = {
  dateOfBirth: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  onCancel: () => void;
  onSuccess: () => void;
};

type ProfileDetailsErrors = Partial<Record<"dateOfBirth" | "email" | "firstName" | "lastName", string>>;
type ProfileActionData = CustomerResponse | { message?: string; statusCode?: number };

const PROFILE_FIELD_IDS = {
  firstName: "profile-first-name",
  lastName: "profile-last-name",
  email: "profile-email",
  dateOfBirth: "profile-date-of-birth",
} as const;

function isSuccessfulProfileAction(data: ProfileActionData | undefined): data is CustomerResponse {
  return Boolean(data && "id" in data);
}

export function ProfileDetailsForm({
  dateOfBirth,
  email,
  firstName,
  lastName,
  onCancel,
  onSuccess,
}: ProfileDetailsFormProps) {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<ProfileActionData>();
  const submitted = useRef(false);
  const [values, setValues] = useState({
    firstName: firstName ?? "",
    lastName: lastName ?? "",
    email,
    dateOfBirth,
  });
  const [errors, setErrors] = useState<ProfileDetailsErrors>({});

  const isSubmitting = fetcher.state !== "idle";
  const serverError =
    fetcher.data && !isSuccessfulProfileAction(fetcher.data)
      ? fetcher.data.message || t("profile.unableToSaveDetails")
      : "";

  useEffect(() => {
    if (submitted.current && fetcher.state === "idle" && isSuccessfulProfileAction(fetcher.data)) {
      submitted.current = false;
      onSuccess();
    }
  }, [fetcher.data, fetcher.state, onSuccess]);

  const updateValue = (field: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const nextErrors: ProfileDetailsErrors = {
      firstName: getTranslatedError(validateName(values.firstName, "First name")),
      lastName: getTranslatedError(validateName(values.lastName, "Last name")),
      email: getTranslatedError(validateEmailFormat(values.email)),
      dateOfBirth: getTranslatedError(validateDateOfBirth(values.dateOfBirth)),
    };
    setErrors(nextErrors);

    const firstInvalidField = (Object.keys(PROFILE_FIELD_IDS) as Array<keyof typeof PROFILE_FIELD_IDS>).find(
      (field) => nextErrors[field]
    );
    if (firstInvalidField) {
      event.preventDefault();
      requestAnimationFrame(() => document.getElementById(PROFILE_FIELD_IDS[firstInvalidField])?.focus());
      return;
    }

    submitted.current = true;
  };

  function getTranslatedError(error: string | null) {
    return error ? t(getRegistrationErrorKey(error) as never) : undefined;
  }

  return (
    <fetcher.Form className="profile-details-form" method="post" noValidate onSubmit={handleSubmit}>
      <input name="actionType" type="hidden" value="changePersonal" />

      <div className="profile-details-form__name-row">
        <AuthFormField error={errors.firstName} inputId={PROFILE_FIELD_IDS.firstName} label={t("profile.firstName")}>
          <InputField
            aria-describedby={`${PROFILE_FIELD_IDS.firstName}-error`}
            autoComplete="given-name"
            id={PROFILE_FIELD_IDS.firstName}
            isValid={!errors.firstName}
            name="firstName"
            onChange={(value) => updateValue("firstName", value)}
            value={values.firstName}
          />
        </AuthFormField>

        <AuthFormField error={errors.lastName} inputId={PROFILE_FIELD_IDS.lastName} label={t("profile.lastName")}>
          <InputField
            aria-describedby={`${PROFILE_FIELD_IDS.lastName}-error`}
            autoComplete="family-name"
            id={PROFILE_FIELD_IDS.lastName}
            isValid={!errors.lastName}
            name="lastName"
            onChange={(value) => updateValue("lastName", value)}
            value={values.lastName}
          />
        </AuthFormField>
      </div>

      <AuthFormField error={errors.email} inputId={PROFILE_FIELD_IDS.email} label={t("profile.emailAddress")}>
        <InputField
          aria-describedby={`${PROFILE_FIELD_IDS.email}-error`}
          autoComplete="email"
          id={PROFILE_FIELD_IDS.email}
          inputMode="email"
          isValid={!errors.email}
          name="email"
          onChange={(value) => updateValue("email", value)}
          type="email"
          value={values.email}
        />
      </AuthFormField>

      <AuthFormField
        error={errors.dateOfBirth}
        inputId={PROFILE_FIELD_IDS.dateOfBirth}
        label={t("profile.dateOfBirth")}
      >
        <InputField
          aria-describedby={`${PROFILE_FIELD_IDS.dateOfBirth}-error`}
          autoComplete="bday"
          id={PROFILE_FIELD_IDS.dateOfBirth}
          isValid={!errors.dateOfBirth}
          name="dateOfBirth"
          onChange={(value) => updateValue("dateOfBirth", value)}
          type="date"
          value={values.dateOfBirth}
        />
      </AuthFormField>

      <div className="profile-details-form__server-error" aria-live="polite">
        {serverError && <p>{serverError}</p>}
      </div>

      <div className="profile-details-form__actions">
        <Button disabled={isSubmitting} onClick={onCancel} text={t("profile.cancel")} variant="light" />
        <Button
          disabled={isSubmitting}
          text={isSubmitting ? t("profile.saving") : t("profile.saveChanges")}
          type="submit"
        />
      </div>
    </fetcher.Form>
  );
}
