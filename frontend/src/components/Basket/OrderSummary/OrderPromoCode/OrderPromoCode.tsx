import { isAxiosError } from "axios";
import { useState, type FormEvent } from "react";
import { MdOutlineDiscount } from "react-icons/md";
import { PiX } from "react-icons/pi";

import Button from "../../../common/button/button";
import { IconButton } from "../../../common/IconButton/IconButton";
import InputField from "../../../common/inputField/inputField";
import { useCart } from "../../../context/useCart";

import "./OrderPromoCodeStyles.scss";

function apiErrorMessage(error: unknown) {
  if (isAxiosError<{ message?: string }>(error) && error.response?.data.message) return error.response.data.message;
  return "We couldn't apply this promo code. Please try again.";
}

export default function OrderPromoCode() {
  const { applyPromoCode, cart, removePromoCode } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedCode = promoCode.trim().toUpperCase();
    if (!normalizedCode) {
      setError("Enter a promo code.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await applyPromoCode(normalizedCode);
      setPromoCode("");
    } catch (submitError) {
      setError(apiErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeCode = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await removePromoCode();
    } catch (removeError) {
      setError(apiErrorMessage(removeError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="order-promo">
      {cart?.discountCode && (
        <div aria-label="Applied promo code" className="order-promo__applied">
          <MdOutlineDiscount aria-hidden="true" />
          <div>
            <strong>{cart.discountCode.code}</strong>
            <span>{cart.discountCode.description}</span>
          </div>
          <IconButton
            disabled={isSubmitting}
            icon={<PiX />}
            label={`Remove promo code ${cart.discountCode.code}`}
            onClick={() => void removeCode()}
            size="small"
          />
        </div>
      )}

      <form aria-label="Promo code" className="order-promo__form" onSubmit={(event) => void handleSubmit(event)}>
        <InputField
          aria-describedby={error ? "promo-code-error" : undefined}
          aria-label="Promo code"
          disabled={isSubmitting}
          icon={<MdOutlineDiscount />}
          inputClassName="order-promo__input"
          isValid={!error}
          name="promoCode"
          onChange={setPromoCode}
          placeholder="Add promo code"
          value={promoCode}
        />
        <Button
          className="order-promo__apply"
          disabled={isSubmitting}
          text={isSubmitting ? "Applying…" : "Apply"}
          type="submit"
        />
      </form>

      {error && (
        <p className="order-promo__error" id="promo-code-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
