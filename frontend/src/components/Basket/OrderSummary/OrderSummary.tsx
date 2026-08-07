import { PiArrowRight } from "react-icons/pi";
import { Link } from "react-router-dom";

import Button from "../../common/button/button";
import { useCart } from "../../context/useCart";
import OrderPromoCode from "./OrderPromoCode/OrderPromoCode";

import "./OrderSummaryStyles.scss";

const moneyFormatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

const money = (amount = 0) => moneyFormatter.format(amount / 100);

export default function OrderSummary() {
  const { cart } = useCart();
  const subtotal = cart?.subtotal.amount ?? 0;
  const discount = cart?.discount.amount ?? 0;
  const total = cart?.total.amount ?? 0;

  return (
    <aside aria-labelledby="order-summary-title" className="order-summary">
      <h2 id="order-summary-title">Order Summary</h2>

      <dl className="order-summary__amounts">
        <div>
          <dt>Subtotal</dt>
          <dd>{money(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="order-summary__discount">
            <dt>Discount</dt>
            <dd>-{money(discount)}</dd>
          </div>
        )}
        <div className="order-summary__total">
          <dt>Total</dt>
          <dd>{money(total)}</dd>
        </div>
      </dl>

      <OrderPromoCode />

      <Button
        aria-describedby="checkout-note"
        className="order-summary__checkout"
        disabled
        icon={<PiArrowRight />}
        text="Checkout unavailable"
      />
      <p className="order-summary__checkout-note" id="checkout-note">
        Checkout is not available in this demo yet.
      </p>
      <Link className="order-summary__continue" to="/catalog">
        Continue shopping
      </Link>
    </aside>
  );
}
