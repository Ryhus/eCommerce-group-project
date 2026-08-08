import { useState, type FormEvent } from "react";
import { MdOutlineDiscount } from "react-icons/md";
import { PiX } from "react-icons/pi";
import { useTranslation } from "react-i18next";

import Button from "../../../common/button/button";
import { IconButton } from "../../../common/IconButton/IconButton";
import InputField from "../../../common/inputField/inputField";
import { useCart } from "../../../context/useCart";

import "./OrderPromoCodeStyles.scss";

type PromoError = "required" | "request";

export default function OrderPromoCode() {
  const { t } = useTranslation("common");
  const { applyPromoCode, cart, removePromoCode } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [error, setError] = useState<PromoError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedCode = promoCode.trim().toUpperCase();
    if (!normalizedCode) {
      setError("required");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await applyPromoCode(normalizedCode);
      setPromoCode("");
    } catch {
      setError("request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeCode = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await removePromoCode();
    } catch {
      setError("request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="order-promo">
      {cart?.discountCode && (
        <div aria-label={t("promoCode.applied")} className="order-promo__applied">
          <MdOutlineDiscount aria-hidden="true" />
          <div>
            <strong>{cart.discountCode.code}</strong>
            <span>{t("promoCode.appliedDescription")}</span>
          </div>
          <IconButton
            disabled={isSubmitting}
            icon={<PiX />}
            label={t("promoCode.remove", { code: cart.discountCode.code })}
            onClick={() => void removeCode()}
            size="small"
          />
        </div>
      )}

      <form
        aria-label={t("promoCode.form")}
        className="order-promo__form"
        onSubmit={(event) => void handleSubmit(event)}
      >
        <InputField
          aria-describedby={error ? "promo-code-error" : undefined}
          aria-label={t("promoCode.label")}
          disabled={isSubmitting}
          icon={<MdOutlineDiscount />}
          inputClassName="order-promo__input"
          isValid={!error}
          name="promoCode"
          onChange={setPromoCode}
          placeholder={t("promoCode.placeholder")}
          value={promoCode}
        />
        <Button
          className="order-promo__apply"
          disabled={isSubmitting}
          text={isSubmitting ? t("promoCode.applying") : t("promoCode.apply")}
          type="submit"
        />
      </form>

      {error && (
        <p className="order-promo__error" id="promo-code-error" role="alert">
          {t(`promoCode.${error}`)}
        </p>
      )}
    </div>
  );
}
