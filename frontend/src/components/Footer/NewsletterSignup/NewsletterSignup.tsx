import { useState, type ComponentPropsWithoutRef, type FormEvent } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { subscribeToNewsletter } from "../../../services/newsletterService/newsletterService";
import { validateEmailFormat } from "../../../utils/validation";
import Button from "../../common/button/button";
import { H2 } from "../../common/headings/H2";
import InputField from "../../common/inputField/inputField";
import Message from "../../common/message/Message";

import "./NewsletterSignup.scss";

type NewsletterSignupProps = Omit<ComponentPropsWithoutRef<"section">, "children">;

type NewsletterFeedbackKey =
  "newsletter.emailRequired" | "newsletter.error" | "newsletter.invalidEmail" | "newsletter.success";

type Feedback = {
  key: NewsletterFeedbackKey;
  variant: "error" | "success";
};

const NewsletterSignup = ({ className = "", ...props }: NewsletterSignupProps) => {
  const { t } = useTranslation("common");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<NewsletterFeedbackKey | null>(null);
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
      const errorKey = normalizedEmail ? "newsletter.invalidEmail" : "newsletter.emailRequired";
      setEmailError(errorKey);
      setFeedback({ key: errorKey, variant: "error" });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      await subscribeToNewsletter(normalizedEmail);
      setEmail("");
      setFeedback({ key: "newsletter.success", variant: "success" });
    } catch {
      setFeedback({ key: "newsletter.error", variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionClassName = `newsletter-signup ${className}`.trim();

  return (
    <section {...props} className={sectionClassName}>
      <H2 className="newsletter-signup__heading" text={t("newsletter.heading")} />

      <form aria-label={t("newsletter.form")} className="newsletter-signup__form" onSubmit={handleSubmit} noValidate>
        <InputField
          aria-label={t("newsletter.email")}
          autoComplete="email"
          disabled={isSubmitting}
          icon={<MdOutlineEmail />}
          inputMode="email"
          isValid={!emailError}
          maxLength={254}
          name="email"
          onChange={handleEmailChange}
          placeholder={t("newsletter.placeholder")}
          required
          type="email"
          value={email}
          wrapperClassName="newsletter-signup__input"
        />
        <Button
          className="btn-medium newsletter-signup__button"
          disabled={isSubmitting}
          text={isSubmitting ? t("newsletter.submitting") : t("newsletter.submit")}
          type="submit"
          variant="light"
        />
      </form>

      {feedback && <Message onClose={() => setFeedback(null)} text={t(feedback.key)} variant={feedback.variant} />}
    </section>
  );
};

export default NewsletterSignup;
