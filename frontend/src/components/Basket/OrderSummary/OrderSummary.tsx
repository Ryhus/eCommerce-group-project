import { PiArrowRight } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { formatMoney } from "../../../utils/formatMoney";
import Button from "../../common/button/button";
import { useCart } from "../../context/useCart";
import OrderPromoCode from "./OrderPromoCode/OrderPromoCode";

import "./OrderSummaryStyles.scss";

export default function OrderSummary() {
  const { t, i18n } = useTranslation("common");
  const { cart } = useCart();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const money = (amount = 0) => formatMoney(amount, language);
  const subtotal = cart?.subtotal.amount ?? 0;
  const discount = cart?.discount.amount ?? 0;
  const total = cart?.total.amount ?? 0;

  return (
    <aside aria-labelledby="order-summary-title" className="order-summary">
      <h2 id="order-summary-title">{t("orderSummary.title")}</h2>

      <dl className="order-summary__amounts">
        <div>
          <dt>{t("orderSummary.subtotal")}</dt>
          <dd>{money(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="order-summary__discount">
            <dt>{t("orderSummary.discount")}</dt>
            <dd>{money(-discount)}</dd>
          </div>
        )}
        <div className="order-summary__total">
          <dt>{t("orderSummary.total")}</dt>
          <dd>{money(total)}</dd>
        </div>
      </dl>

      <OrderPromoCode />

      <Button
        aria-describedby="checkout-note"
        className="order-summary__checkout"
        disabled
        icon={<PiArrowRight />}
        text={t("orderSummary.checkoutUnavailable")}
      />
      <p className="order-summary__checkout-note" id="checkout-note">
        {t("orderSummary.checkoutNote")}
      </p>
      <Link className="order-summary__continue" to="/catalog">
        {t("orderSummary.continueShopping")}
      </Link>
    </aside>
  );
}
