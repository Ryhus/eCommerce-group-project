import { useState, type ComponentPropsWithoutRef, type FormEvent } from "react";
import { MdOutlineEmail } from "react-icons/md";

import { subscribeToNewsletter } from "../../../services/newsletterService/newsletterService";
import { validateEmailFormat } from "../../../utils/validation";
import Button from "../../common/button/button";
import { H2 } from "../../common/headings/H2";
import InputField from "../../common/inputField/inputField";
import Message from "../../common/message/Message";

import "./NewsletterSignup.scss";

type NewsletterSignupProps = Omit<ComponentPropsWithoutRef<"section">, "children">;

type Feedback = {
  text: string;
  variant: "error" | "success";
};

const NewsletterSignup = ({ className = "", ...props }: NewsletterSignupProps) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const validationError = validateEmailFormat(normalizedEmail);

    if (validationError) {
      setEmailError(validationError);
      setFeedback({ text: validationError, variant: "error" });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      await subscribeToNewsletter(normalizedEmail);
      setEmail("");
      setFeedback({ text: "You're subscribed to Sport Gear updates.", variant: "success" });
    } catch {
      setFeedback({ text: "Unable to subscribe right now. Please try again.", variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionClassName = `newsletter-signup ${className}`.trim();

  return (
    <section {...props} className={sectionClassName}>
      <H2 className="newsletter-signup__heading" text="STAY UP TO DATE ABOUT OUR LATEST OFFERS" />

      <form aria-label="Newsletter subscription" className="newsletter-signup__form" onSubmit={handleSubmit} noValidate>
        <InputField
          aria-label="Email address"
          autoComplete="email"
          disabled={isSubmitting}
          icon={<MdOutlineEmail />}
          inputMode="email"
          isValid={!emailError}
          maxLength={254}
          name="email"
          onChange={handleEmailChange}
          placeholder="Enter your email address"
          required
          type="email"
          value={email}
          wrapperClassName="newsletter-signup__input"
        />
        <Button
          className="btn-medium newsletter-signup__button"
          disabled={isSubmitting}
          text={isSubmitting ? "Subscribing..." : "Subscribe to Newsletter"}
          type="submit"
          variant="light"
        />
      </form>

      {feedback && <Message onClose={() => setFeedback(null)} text={feedback.text} variant={feedback.variant} />}
    </section>
  );
};

export default NewsletterSignup;
