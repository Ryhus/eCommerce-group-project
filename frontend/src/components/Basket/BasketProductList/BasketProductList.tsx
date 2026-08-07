import { PiShoppingCart } from "react-icons/pi";
import { Link } from "react-router-dom";

import { useCart } from "../../context/useCart";
import { BasketProductCard } from "../BasketProductCard/BasketProductCard";

import "./BasketProductList.scss";

export function BasketProductList() {
  const { cart } = useCart();
  const items = cart?.items ?? [];

  if (!items.length) {
    return (
      <section aria-labelledby="empty-cart-title" className="basket-empty">
        <PiShoppingCart aria-hidden="true" />
        <h2 id="empty-cart-title">Your cart is empty</h2>
        <p>Explore the catalog and add something for your next training session.</p>
        <Link className="basket-empty__link" to="/catalog">
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section aria-label="Cart items" className="basket-list">
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <BasketProductCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
