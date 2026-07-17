import { useNavigate } from "react-router-dom";
import Link from "../../common/link/link";
import { useCart } from "../../context/useCart";
import { BasketProductCard } from "../BasketProductCard/BasketProductCard";
import "./BasketProductList.scss";

export function BasketProductList() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const products = cart?.items ?? [];

  return (
    <div className="basket-list-container">
      {products.length ? (
        products.map((item) => (
          <BasketProductCard
            key={item.id}
            productName={item.name}
            quantity={item.quantity}
            imgUrl={item.image ?? "/images/loading.gif"}
            productId={item.productId}
            productPrice={`Price: €${(item.unitPrice.amount / 100).toFixed(2)}`}
            totalPrice={`Total: €${(item.lineTotal.amount / 100).toFixed(2)}`}
          />
        ))
      ) : (
        <Link
          className="cart-to-catalog-link"
          text="Empty cart? Click on me and buy our products 🥎"
          onClick={(event) => {
            event.preventDefault();
            navigate("/catalog");
          }}
          href="/catalog"
        />
      )}
    </div>
  );
}
