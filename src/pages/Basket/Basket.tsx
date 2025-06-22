import { BasketProductList } from "../../components/Basket/BasketProductList/BasketProductList";
import { useCart } from "../../components/context/useCart";
import OrderSummary from "../../components/Basket/OrderSummary/OrderSummary";
import Button from "../../components/common/button/button";
import "./BasketPageStyles.scss";

export default function BasketPage() {
  const { clearCart } = useCart();
  return (
    <div className="basket-page-container">
      <Button className="clear-cart-btn" text="Clear cart" onClick={clearCart} />
      <div className="cart-order-data">
        <BasketProductList />
        <OrderSummary />
      </div>
    </div>
  );
}
