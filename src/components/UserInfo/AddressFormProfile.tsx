import { useState } from "react";
import Paragraph from "../common/paragraph/paragraph.js";
import InputField from "../common/inputField/inputField.js";
import { Form } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { validateStreet, validateCity, validatePostalCode, validateCountry } from "../../utils/validation.js";

interface AddressFormProps {
  formType: string;
  clearMode: () => void;
}

export function AddressForm({ formType }: AddressFormProps) {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const [streetError, setStreetError] = useState("");
  const [cityError, setCityError] = useState("");
  const [postalCodeError, setPostalCodeError] = useState("");
  const [countryError, setCountryError] = useState("");

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

  return (
    <Form className="change-address-form" method="post">
      <input type="hidden" name="actionType" value={formType} />
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
    </Form>
  );
}
