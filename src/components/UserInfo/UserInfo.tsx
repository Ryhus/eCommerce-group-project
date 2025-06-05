import { useState } from "react";
import Button from "../common/button/button";
import { H2 } from "../common/headings/H2";
import { H3 } from "../common/headings/H3";
import { HiPencilAlt, HiOutlineLocationMarker, HiOutlineKey } from "react-icons/hi";
import Paragraph from "../common/paragraph/paragraph";
import type { Address } from "../../services/customerService/types";
import { Form } from "react-router-dom";
import InputField from "../common/inputField/inputField";
import { validateName, validateEmailFormat, validateDateOfBirth } from "../../utils/validation";
import "./UserInfo.scss";

interface UserInfoProps {
  email: string;
  dateOfBirth: Date;
  firstName?: string | null;
  lastName?: string | null;
  adresses?: Address[] | null;
  defaultShippingAddress?: string | null;
  defaultBillingAddress?: string | null;
  shippingAddressIds?: string[] | null;
  billingAddressIds?: string[] | null;
}

export function UserInfo({
  firstName,
  lastName,
  email,
  dateOfBirth,
  adresses,
  shippingAddressIds = [],
}: UserInfoProps) {
  const [isEditMode, setEditMode] = useState(false);
  const [isChangePassword, setChangePassword] = useState(false);
  const [changedFirstName, setFirstName] = useState(firstName || "");
  const [changedLastName, setLastName] = useState(lastName || "");
  const [changedEmail, setEmail] = useState(email);
  const [dob, setDob] = useState(dateOfBirth.toString());
  //   const [changedPassword, setChangedPassword] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [dobError, setDobError] = useState("");

  const billingAddresses = adresses?.map((address) => (
    <li className="user-address" key={address.id}>
      {<HiOutlineLocationMarker />}
      {`${address.streetName}, ${address.postalCode}, ${address.city}, ${address.country}`}
    </li>
  ));

  const shippingAddresses = adresses?.map((address) => {
    if (address.id && shippingAddressIds?.includes(address.id)) {
      return (
        <li className="user-address" key={address.id}>
          {<HiOutlineLocationMarker />}
          {`${address.streetName}, ${address.postalCode}, ${address.city}, ${address.country}`}
        </li>
      );
    }
  });

  const validateEmail = (value: string) => {
    const error = validateEmailFormat(value);
    setEmailError(error || "");
    return !error;
  };

  //return all form states to initial ones
  const clearAllFormStates = function () {
    setFirstName(firstName || "");
    setLastName(lastName || "");
    setEmail(email);
    setDob(dateOfBirth.toString());
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setDobError("");
  };

  // client side validation function
  const validateAllInputs = function () {
    const firstNameValid = !validateName(changedFirstName, "First name");
    const lastNameValid = !validateName(changedLastName, "Last name");
    const isEmailValid = validateEmail(changedEmail);
    const dobValid = !validateDateOfBirth(dob.toString());

    setFirstNameError(validateName(changedFirstName, "First name") || "");
    setLastNameError(validateName(changedLastName, "Last name") || "");
    setDobError(validateDateOfBirth(dob) || "");

    if (firstNameValid && lastNameValid && isEmailValid && dobValid) return true;
    return false;
  };

  return (
    <div className="user-profile-container">
      <div className="user-info-container">
        <div className="user-login-names-container">
          <H2 text={`${firstName} ${lastName}`} className="user-names"></H2>
          <Paragraph text={email} className="user-email"></Paragraph>
          <Paragraph text={dateOfBirth.toString()} className="user-email"></Paragraph>
          <div className={isEditMode ? "hidden" : "edit-profile-btns-container"}>
            <Button
              text="Edit profile"
              icon={<HiPencilAlt />}
              variant="light"
              className="edit-info-btn"
              onClick={() => setEditMode(!isEditMode)}
            ></Button>
            <Button
              text="Change password"
              icon={<HiOutlineKey />}
              variant="light"
              className="edit-info-btn"
              onClick={() => setChangePassword(!isChangePassword)}
            ></Button>
          </div>
        </div>
        {isChangePassword && (
          <Form className="personal-info-form" method="post">
            <div className="field-group">
              <InputField
                name="firstName"
                value={changedFirstName ? changedFirstName : ""}
                onChange={(v) => {
                  setFirstName(v);
                  setFirstNameError(validateName(v, "First name") || "");
                }}
                isValid={!firstNameError}
              ></InputField>
              {firstNameError && <Paragraph text={firstNameError} isError />}
            </div>
            <div className="field-group">
              <InputField
                name="lastName"
                value={changedLastName ? changedLastName : ""}
                onChange={(v) => {
                  setLastName(v);
                  setLastNameError(validateName(v, "Last name") || "");
                }}
                isValid={!lastNameError}
              ></InputField>
              {lastNameError && <Paragraph text={lastNameError} isError />}
            </div>
            <Button
              type="submit"
              text="✅ Save"
              variant="light"
              className="confirm-btn"
              onClick={(e) => {
                const isValidFrom = validateAllInputs();
                if (!isValidFrom) {
                  e.preventDefault();
                  return;
                }
                setTimeout(() => setEditMode(!isEditMode), 10);
              }}
            ></Button>
            <Button
              type="button"
              text="❌ Cancel"
              variant="light"
              className="cancel-btn"
              onClick={() => {
                // clearAllFormStates();
                setChangePassword(!isChangePassword);
              }}
            ></Button>
          </Form>
        )}
        {isEditMode && (
          <Form className="personal-info-form" method="post">
            <div className="field-group">
              <InputField
                name="firstName"
                value={changedFirstName ? changedFirstName : ""}
                onChange={(v) => {
                  setFirstName(v);
                  setFirstNameError(validateName(v, "First name") || "");
                }}
                isValid={!firstNameError}
              ></InputField>
              {firstNameError && <Paragraph text={firstNameError} isError />}
            </div>
            <div className="field-group">
              <InputField
                name="lastName"
                value={changedLastName ? changedLastName : ""}
                onChange={(v) => {
                  setLastName(v);
                  setLastNameError(validateName(v, "Last name") || "");
                }}
                isValid={!lastNameError}
              ></InputField>
              {lastNameError && <Paragraph text={lastNameError} isError />}
            </div>

            <div className="field-group">
              <InputField
                name="email"
                value={changedEmail}
                onChange={(v) => {
                  setEmail(v);
                  validateEmail(v);
                }}
                isValid={!emailError}
              ></InputField>
              {emailError && <Paragraph text={emailError} isError />}
            </div>

            <div className="field-group">
              <InputField
                name="dateOfBirth"
                value={dob}
                isValid={!dobError}
                type="date"
                onChange={(v) => {
                  setDob(v);
                  setDobError(validateDateOfBirth(v) || "");
                }}
              ></InputField>
              {dobError && <Paragraph text={dobError} isError />}
            </div>

            <Button
              type="submit"
              text="✅ Save"
              variant="light"
              className="confirm-btn"
              onClick={(e) => {
                const isValidFrom = validateAllInputs();
                if (!isValidFrom) {
                  e.preventDefault();
                  return;
                }
                setTimeout(() => setEditMode(!isEditMode), 10);
              }}
            ></Button>
            <Button
              type="button"
              text="❌ Cancel"
              variant="light"
              className="cancel-btn"
              onClick={() => {
                clearAllFormStates();
                setEditMode(!isEditMode);
              }}
            ></Button>
          </Form>
        )}

        <div className="profile-addresses-container">
          {billingAddresses && (
            <div className="address-container-profile">
              <H3 text="Billing addresses:" className="address-heading"></H3>
              <ul className="user-adresses-list">{billingAddresses}</ul>
            </div>
          )}

          {shippingAddresses && (
            <div className="address-container-profile">
              <H3 text="Shipping addresses:" className="address-heading"></H3>
              <ul className="user-adresses-list">{shippingAddresses}</ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
