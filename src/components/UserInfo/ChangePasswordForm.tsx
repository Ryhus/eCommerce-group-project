import { useState } from "react";
import Button from "../common/button/button";
import InputField from "../common/inputField/inputField";
import { Form } from "react-router-dom";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <Form className="personal-info-form" method="post">
      <div className="field-group">
        <InputField
          name="firstName"
          value={currentPassword ? currentPassword : ""}
          onChange={(v) => {
            setCurrentPassword(v);
          }}
        ></InputField>
      </div>
      <div className="field-group">
        <InputField
          name="lastName"
          value={newPassword ? newPassword : ""}
          onChange={(v) => {
            setNewPassword(v);
          }}
        ></InputField>
      </div>
      <Button
        type="submit"
        text="✅ Save"
        variant="light"
        className="confirm-btn"
        // onClick={(e) => {
        //   const isValidFrom = validateAllInputs();
        //   if (!isValidFrom) {
        //     e.preventDefault();
        //     return;
        //   }
        //   setTimeout(() => setEditMode(!isEditMode), 10);
        // }}
      ></Button>
      <Button
        type="button"
        text="❌ Cancel"
        variant="light"
        className="cancel-btn"
        // onClick={() => {
        //   // clearAllFormStates();
        //   setChangePassword(!isChangePassword);
        // }}
      ></Button>
    </Form>
  );
}
