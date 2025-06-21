import { H3 } from "../../common/headings/H3";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import OrderField from "./OrderField/OrderField";
import OrderPromoCode from "./OrderPromoCode/OrderPromoCode";

import "./OrderSummaryStyles.scss";
import { useCart } from "../../context/CartContext";

type priceType = "total" | "discount" | "subtotal";

export default function OrderSummary() {
  const { cart } = useCart();

  const handlePrice = (priceType: priceType) => {
    const totalPriceCents = cart?.totalPrice?.centAmount || 0;
    const totalPriceFraction = cart?.totalPrice?.fractionDigits || 0;
    const totalPrice = totalPriceCents / 100;

    const discountedPriceCents = cart?.discountOnTotalPrice?.discountedAmount?.centAmount || 0;
    const discountedPriceFraction = cart?.discountOnTotalPrice?.discountedAmount?.fractionDigits || 0;
    const discountedPrice = discountedPriceCents / 100;

    if (priceType === "total") {
      return "€" + totalPrice.toFixed(totalPriceFraction);
    } else if (priceType === "discount") {
      return "€" + discountedPrice.toFixed(discountedPriceFraction);
    } else {
      return "€" + (discountedPrice + totalPrice).toFixed(totalPriceFraction);
    }
  };

  return (
    <div className="order-summary-container">
      <H3 text="Order summary" className="order-summary-heading" />
      <div className="order-subtotals">
        <OrderField className="order-field subtotal-field" fieldName="Subtotal" price={handlePrice("subtotal")} />
        <OrderField className="order-field discount-field" fieldName="Discount" price={handlePrice("discount")} />
        <TfiLayoutLineSolid />
        <OrderField className="order-field total-field" fieldName="Total" price={handlePrice("total")} />
      </div>
      <OrderPromoCode />
    </div>
  );
}
