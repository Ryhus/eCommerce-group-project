import { TfiLayoutLineSolid } from "react-icons/tfi";
import { H3 } from "../../common/headings/H3";
import { useCart } from "../../context/useCart";
import OrderField from "./OrderField/OrderField";
import OrderPromoCode from "./OrderPromoCode/OrderPromoCode";
import "./OrderSummaryStyles.scss";

const money = (amount = 0) => `€${(amount / 100).toFixed(2)}`;

export default function OrderSummary() {
  const { cart } = useCart();
  return (
    <div className="order-summary-container">
      <H3 text="Order summary" className="order-summary-heading" />
      <div className="order-subtotals">
        <OrderField className="order-field subtotal-field" fieldName="Subtotal" price={money(cart?.subtotal.amount)} />
        <OrderField className="order-field discount-field" fieldName="Discount" price={money(cart?.discount.amount)} />
        <TfiLayoutLineSolid />
        <OrderField className="order-field total-field" fieldName="Total" price={money(cart?.total.amount)} />
      </div>
      <OrderPromoCode />
    </div>
  );
}
