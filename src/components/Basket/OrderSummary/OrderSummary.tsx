import { H3 } from "../../common/headings/H3";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import OrderField from "./OrderField/OrderField";
import OrderPromoCode from "./OrderPromoCode/OrderPromoCode";

import "./OrderSummaryStyles.scss";
import { useCart } from "../../context/CartContext";

type priceType = "total" | "discount";

export default function OrderSummary() {
  const { cart } = useCart();

  const calcPrice = (centPrice: number, fractionDigits: number) => {
    const price = centPrice / 100;
    const precisionPrice = "€" + price.toFixed(fractionDigits);
    return precisionPrice;
  };

  const handlePrice = (priceType: priceType) => {
    if (priceType === "total") {
      const totalPrice = cart?.totalPrice;
      if (totalPrice) {
        const { centAmount, fractionDigits } = totalPrice;
        return calcPrice(centAmount, fractionDigits);
      } else return "€0";
    } else {
      const discountPrice = cart?.discountOnTotalPrice;
      if (discountPrice) {
        const {
          discountedAmount: { centAmount, fractionDigits },
        } = discountPrice;
        return "-" + calcPrice(centAmount, fractionDigits);
      } else return "€0";
    }
  };

  return (
    <div className="order-summary-container">
      <H3 text="Order summary" className="order-summary-heading" />
      <div className="order-subtotals">
        <OrderField className="order-field subtotal-field" fieldName="Subtotal" price={handlePrice("total")} />
        <OrderField className="order-field discount-field" fieldName="Discount" price={handlePrice("discount")} />
        <TfiLayoutLineSolid />
        <OrderField className="order-field total-field" fieldName="Total" price={handlePrice("total")} />
      </div>
      <OrderPromoCode />
      <div className="order-checkout"></div>
    </div>
  );
}
