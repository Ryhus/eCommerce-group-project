import { useState } from "react";
import Button from "../common/button/button";
import { H2 } from "../common/headings/H2";
import { HiPencilAlt, HiOutlineKey } from "react-icons/hi";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import Paragraph from "../common/paragraph/paragraph";
import type { Address } from "../../services/customerService/types";
import { Form, useActionData } from "react-router-dom";
import InputField from "../common/inputField/inputField";
import { AddressesComponent, BillingAddressesComponent, ShippingAddressesComponent } from "./AddressesProfile";

import {
  validateName,
  validateEmailFormat,
  validateDateOfBirth,
  validatePasswordStrength,
} from "../../utils/validation";

import "./UserInfo.scss";

interface UserInfoProps {
  email: string;
  dateOfBirth: string;
  firstName?: string | null;
  lastName?: string | null;
  adresses?: Address[] | null;
  defaultShippingAddressId?: string | null;
  defaultBillingAddressId?: string | null;
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
  billingAddressIds = [],
  defaultShippingAddressId,
  defaultBillingAddressId,
}: UserInfoProps) {
  const actionData = useActionData() as { message: string; statusCode: number } | undefined;
  const serverError = actionData?.message;

  const [isEditMode, setEditMode] = useState(false);
  const [isChangePassword, setChangePassword] = useState(false);
  const [changedFirstName, setFirstName] = useState(firstName || "");
  const [changedLastName, setLastName] = useState(lastName || "");
  const [changedEmail, setEmail] = useState(email);
  const [dob, setDob] = useState(dateOfBirth.toString());
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [dobError, setDobError] = useState("");
  const [showCurrentPasswordError, setCurrentPasswordError] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hideEditbuttons = function () {
    if (isChangePassword || isEditMode) return "hidden";
    return "edit-profile-btns-container";
  };

  const validateEmail = (value: string) => {
    const error = validateEmailFormat(value);
    setEmailError(error || "");
    return !error;
  };

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

  const clearPasswordFromstates = function () {
    setNewPassword("");
    setPasswordError("");
    setCurrentPassword("");
    setCurrentPasswordError(false);
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

  const validatePassword = (value: string) => {
    const error = validatePasswordStrength(value);
    setPasswordError(error || "");
    return !error;
  };

  return (
    <div className="user-profile-container">
      <div className="user-info-container">
        <div className="user-login-names-container">
          <H2 text={`${firstName} ${lastName}`} className="user-names"></H2>
          <Paragraph text={email} className="user-email"></Paragraph>
          <Paragraph text={dateOfBirth.toString()} className="user-email"></Paragraph>
          <div className={hideEditbuttons()}>
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
            <input type="hidden" name="actionType" value="changePassword" />
            <div className="field-group">
              <InputField
                name="currentPassword"
                placeholder="Current password"
                value={currentPassword}
                onChange={(v) => {
                  setCurrentPassword(v);
                }}
                type={showCurrentPassword ? "text" : "password"}
                rightIcon={
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      setShowCurrentPassword((prev) => !prev);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                }
              ></InputField>
              {serverError && showCurrentPasswordError && <Paragraph text={serverError} isError />}
            </div>
            <div className="field-group">
              <InputField
                name="newPassword"
                placeholder="New Password"
                value={newPassword}
                isValid={!passwordError}
                onChange={(v) => {
                  setNewPassword(v);
                  if (passwordError) validatePassword(v);
                }}
                type={showPassword ? "text" : "password"}
                rightIcon={
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword((prev) => !prev);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                }
              ></InputField>
              {passwordError && <Paragraph text={passwordError} isError />}
            </div>
            <Button
              type="submit"
              text="✅ Save"
              variant="light"
              className="confirm-btn"
              onClick={(e) => {
                const isValidForm = validatePassword(newPassword);
                if (!isValidForm) {
                  e.preventDefault();
                  return;
                }
                setCurrentPasswordError(true);
              }}
            ></Button>
            <Button
              type="button"
              text="❌ Cancel"
              variant="light"
              className="cancel-btn"
              onClick={() => {
                clearPasswordFromstates();
                setChangePassword(!isChangePassword);
              }}
            ></Button>
          </Form>
        )}
        {isEditMode && (
          <Form className="personal-info-form" method="post">
            <input type="hidden" name="actionType" value="changePersonal" />
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
                const isValidForm = validateAllInputs();
                if (!isValidForm) {
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
          <AddressesComponent adresses={adresses} />
          <BillingAddressesComponent
            adresses={adresses}
            billingAddressIds={billingAddressIds}
            defaultBillingAddressId={defaultBillingAddressId}
          />
          <ShippingAddressesComponent
            adresses={adresses}
            shippingAddressIds={shippingAddressIds}
            defaultShippingAddressId={defaultShippingAddressId}
          />
        </div>
      </div>
    </div>
  );
}
