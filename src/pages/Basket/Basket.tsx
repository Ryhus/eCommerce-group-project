import { BasketProductList } from "../../components/Basket/BasketProductList/BasketProductList";
import OrderSummary from "../../components/Basket/OrderSummary/OrderSummary";

import "./BasketPageStyles.scss";

export default function BasketPage() {
  return (
    <div className="basket-page-container">
      <BasketProductList />
      <OrderSummary />
    </div>
  );
}
