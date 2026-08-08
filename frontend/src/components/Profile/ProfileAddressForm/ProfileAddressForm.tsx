import { type FormEvent, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router-dom";

import type { Address, CustomerResponse } from "../../../services/customerService/types";
import { validateCity, validateCountry, validatePostalCode, validateStreet } from "../../../utils/validation";
import { COUNTRY_OPTIONS } from "../../../pages/Registration/registrationForm";
import { AuthFormField } from "../../Auth/AuthFormField/AuthFormField";
import Button from "../../common/button/button";
import InputField from "../../common/inputField/inputField";

import "./ProfileAddressForm.scss";

type ProfileAddressFormProps = {
  address?: Address | null;
  onCancel: () => void;
  onSuccess: () => void;
};

type AddressErrors = Partial<Record<"city" | "country" | "postalCode" | "streetName", string>>;
type ProfileActionData = CustomerResponse | { message?: string; statusCode?: number };

const ADDRESS_FIELD_IDS = {
  streetName: "profile-address-street",
  city: "profile-address-city",
  postalCode: "profile-address-postal-code",
  country: "profile-address-country",
} as const;

function isSuccessfulAddressAction(data: ProfileActionData | undefined): data is CustomerResponse {
  return Boolean(data && "id" in data);
}

export function ProfileAddressForm({ address, onCancel, onSuccess }: ProfileAddressFormProps) {
  const fetcher = useFetcher<ProfileActionData>();
  const submitted = useRef(false);
  const [values, setValues] = useState({
    streetName: address?.streetName ?? "",
    city: address?.city ?? "",
    postalCode: address?.postalCode ?? "",
    country: address?.country ?? "",
  });
  const [isDefaultBilling, setIsDefaultBilling] = useState(Boolean(address?.isDefaultBilling));
  const [isDefaultShipping, setIsDefaultShipping] = useState(Boolean(address?.isDefaultShipping));
  const [errors, setErrors] = useState<AddressErrors>({});

  const isEditing = Boolean(address);
  const isSubmitting = fetcher.state !== "idle";
  const serverError =
    fetcher.data && !isSuccessfulAddressAction(fetcher.data)
      ? fetcher.data.message || "Unable to save this address."
      : "";

  useEffect(() => {
    if (submitted.current && fetcher.state === "idle" && isSuccessfulAddressAction(fetcher.data)) {
      submitted.current = false;
      onSuccess();
    }
  }, [fetcher.data, fetcher.state, onSuccess]);

  const updateValue = (field: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const nextErrors: AddressErrors = {
      streetName: validateStreet(values.streetName) ?? undefined,
      city: validateCity(values.city) ?? undefined,
      postalCode: validatePostalCode(values.postalCode) ?? undefined,
      country: validateCountry(values.country) ?? undefined,
    };
    setErrors(nextErrors);

    const firstInvalidField = (Object.keys(ADDRESS_FIELD_IDS) as Array<keyof typeof ADDRESS_FIELD_IDS>).find(
      (field) => nextErrors[field]
    );
    if (firstInvalidField) {
      event.preventDefault();
      requestAnimationFrame(() => document.getElementById(ADDRESS_FIELD_IDS[firstInvalidField])?.focus());
      return;
    }

    submitted.current = true;
  };

  return (
    <fetcher.Form className="profile-address-form" method="post" noValidate onSubmit={handleSubmit}>
      <input name="actionType" type="hidden" value={isEditing ? "changeAddress" : "addAddress"} />
      <input name="addressId" type="hidden" value={address?.id ?? ""} />

      <AuthFormField error={errors.streetName} inputId={ADDRESS_FIELD_IDS.streetName} label="Street address">
        <InputField
          aria-describedby={`${ADDRESS_FIELD_IDS.streetName}-error`}
          autoComplete="street-address"
          id={ADDRESS_FIELD_IDS.streetName}
          isValid={!errors.streetName}
          name="street"
          onChange={(value) => updateValue("streetName", value)}
          placeholder="10 Main Street"
          value={values.streetName}
        />
      </AuthFormField>

      <div className="profile-address-form__location-row">
        <AuthFormField error={errors.city} inputId={ADDRESS_FIELD_IDS.city} label="City">
          <InputField
            aria-describedby={`${ADDRESS_FIELD_IDS.city}-error`}
            autoComplete="address-level2"
            id={ADDRESS_FIELD_IDS.city}
            isValid={!errors.city}
            name="city"
            onChange={(value) => updateValue("city", value)}
            placeholder="Berlin"
            value={values.city}
          />
        </AuthFormField>

        <AuthFormField error={errors.postalCode} inputId={ADDRESS_FIELD_IDS.postalCode} label="Postal code">
          <InputField
            aria-describedby={`${ADDRESS_FIELD_IDS.postalCode}-error`}
            autoComplete="postal-code"
            id={ADDRESS_FIELD_IDS.postalCode}
            isValid={!errors.postalCode}
            name="postalCode"
            onChange={(value) => updateValue("postalCode", value)}
            placeholder="10115"
            value={values.postalCode}
          />
        </AuthFormField>
      </div>

      <AuthFormField error={errors.country} inputId={ADDRESS_FIELD_IDS.country} label="Country">
        <select
          aria-describedby={`${ADDRESS_FIELD_IDS.country}-error`}
          aria-invalid={Boolean(errors.country)}
          autoComplete="country"
          className={`input${errors.country ? " input--error" : ""}`}
          id={ADDRESS_FIELD_IDS.country}
          name="country"
          onChange={(event) => updateValue("country", event.currentTarget.value)}
          value={values.country}
        >
          {COUNTRY_OPTIONS.map(([value, label]) => (
            <option key={value || "placeholder"} value={value}>
              {label}
            </option>
          ))}
        </select>
      </AuthFormField>

      <fieldset className="profile-address-form__defaults">
        <legend>Address preferences</legend>
        <label>
          <input
            checked={isDefaultShipping}
            name="isDefaultShippingAddress"
            onChange={(event) => setIsDefaultShipping(event.currentTarget.checked)}
            type="checkbox"
            value="default"
          />
          <span>Use as default shipping address</span>
        </label>
        <label>
          <input
            checked={isDefaultBilling}
            name="isDefaultBillingAddress"
            onChange={(event) => setIsDefaultBilling(event.currentTarget.checked)}
            type="checkbox"
            value="default"
          />
          <span>Use as default billing address</span>
        </label>
      </fieldset>

      <div className="profile-address-form__server-error" aria-live="polite">
        {serverError && <p>{serverError}</p>}
      </div>

      <div className="profile-address-form__actions">
        <Button disabled={isSubmitting} onClick={onCancel} text="Cancel" variant="light" />
        <Button disabled={isSubmitting} text={isSubmitting ? "Saving…" : "Save address"} type="submit" />
      </div>
    </fetcher.Form>
  );
}
