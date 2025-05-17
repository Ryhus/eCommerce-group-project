import Button from "../../components/common/button/button";
import InputField from "../../components/common/inputField/inputField";
import Link from "../../components/common/link/link";
import Paragraph from "../../components/common/paragraph/paragraph";
import { H2 } from "../../components/common/headings/H2";
import "./Login.scss";

// delete
function setEmail() {
  return;
}
function isValidEmail() {
  return true;
}
//end delete

export default function LoginPage() {
  return (
    <div className="login-wrapper">
      <H2 text="Login" />
      <div className="field-group">
        <Paragraph text="Enter your email address." />
        <InputField value={""} onChange={setEmail} isValid={isValidEmail()} placeholder="you@example.com" />
        <Paragraph text="Email must <list requariments>" isError className="email-error-msg" />
      </div>
      <div className="field-group">
        <div className="password-label">
          <Paragraph text="Enter your password." />
          <Link text="Show password" href="#" />
        </div>
        <InputField value={""} onChange={setEmail} isValid={isValidEmail()} placeholder="Password" />
        <Paragraph text="Passwor must <list requariments>" isError className="email-error-msg" />
      </div>
      <Button className="login-btn" text="Log in" />
      <Link text="Don't have an account? Register" href="#" className="registration-link" />
    </div>
  );
}

{
  /* Optionally: */
}
<span className="error-message">Please enter a valid email.</span>;
