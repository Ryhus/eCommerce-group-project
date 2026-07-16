import { useState } from "react";
import Paragraph from "../common/paragraph/paragraph.js";
import InputField from "../common/inputField/inputField.js";
import Button from "../common/button/button.js";
import { Form } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { validateStreet, validateCity, validatePostalCode, validateCountry } from "../../utils/validation.js";

interface AddressFormProps {
  formType: string;
  addressId: string;
  clearMode: () => void;
}

export function AddressForm({ formType, clearMode, addressId }: AddressFormProps) {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [isDefaultBillingAdrdess, setAsDefaultBillingAdress] = useState(false);
  const [isDefaultShippingAddress, setAsDefaultShippingAddress] = useState(false);

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

  const validateAllInputs = function () {
    const streetValid = !validateStreet(street);
    const cityValid = !validateCity(city);
    const postalValid = !validatePostalCode(postalCode);
    const countryValid = !validateCountry(country);

    setStreetError(validateStreet(street) || "");
    setCityError(validateCity(city) || "");
    setPostalCodeError(validatePostalCode(postalCode) || "");
    setCountryError(validateCountry(country) || "");

    if (streetValid && cityValid && postalValid && countryValid) return true;
    return false;
  };

  const clearAddressFormStates = function () {
    setStreet("");
    setCity("");
    setCountry("");
    setPostalCode("");
    setStreetError("");
    setCityError("");
    setCountryError("");
    setPostalCodeError("");
    clearMode();
  };
  const billingFormsArray = ["addBillingAddress", "changeBillingAddress", "addAddress", "changeAddress"];
  const shippingFormsArray = ["addShippingAddress", "changeShippingAddress", "addAddress", "changeAddress"];
  return (
    <Form className="change-address-form" method="post">
      <input type="hidden" name="actionType" value={formType} />
      <input type="hidden" name="addressId" value={addressId} />
      <div className="field-group">
        <InputField
          name="street"
          value={street}
          onChange={(v) => {
            setStreet(v);
            if (streetError) setStreetError(validateStreet(v) || "");
          }}
          isValid={!streetError}
          placeholder="Street"
          icon={<FaMapMarkerAlt />}
        />
        {streetError && <Paragraph text={streetError} isError />}
      </div>

      <div className="field-group">
        <InputField
          name="city"
          value={city}
          onChange={(v) => {
            setCity(v);
            if (cityError) setCityError(validateCity(v) || "");
          }}
          isValid={!cityError}
          placeholder="City"
          icon={<FaMapMarkerAlt />}
        />
        {cityError && <Paragraph text={cityError} isError />}
      </div>

      <div className="field-group">
        <InputField
          name="postalCode"
          value={postalCode}
          onChange={(v) => {
            setPostalCode(v);
            if (postalCodeError) setPostalCodeError(validatePostalCode(v) || "");
          }}
          isValid={!postalCodeError}
          placeholder="Postal code"
          icon={<FaMapMarkerAlt />}
        />
        {postalCodeError && <Paragraph text={postalCodeError} isError />}
      </div>

      <div className="field-group">
        <select
          name="country"
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

      <div className="field-group set-default-address">
        {billingFormsArray.includes(formType) && (
          <div className="default-billing-address">
            <InputField
              name="isDefaultBillingAddress"
              value={isDefaultBillingAdrdess ? "default" : ""}
              type="checkbox"
              onChange={() => {
                setAsDefaultBillingAdress(!isDefaultBillingAdrdess);
              }}
            ></InputField>
            <Paragraph text="Set as default billing address" />
          </div>
        )}
        {shippingFormsArray.includes(formType) && (
          <div className="default-shipping-address">
            <InputField
              name="isDefaultShippingAddress"
              value={isDefaultShippingAddress ? "default" : ""}
              type="checkbox"
              onChange={() => {
                setAsDefaultShippingAddress(!isDefaultShippingAddress);
              }}
            ></InputField>
            <Paragraph text="Set as default shipping address" />
          </div>
        )}
      </div>
      <Button
        type="submit"
        text="✅ Save"
        variant="light"
        className="confirm-btn"
        onClick={(e) => {
          const isValidForm = validateAllInputs();
          if (!isValidForm) {
            e.preventDefault();
            return;
          }
          setTimeout(() => clearAddressFormStates(), 10);
        }}
      ></Button>
      <Button
        type="button"
        text="❌ Cancel"
        variant="light"
        className="cancel-btn"
        onClick={() => {
          clearAddressFormStates();
        }}
      ></Button>
    </Form>
  );
}
