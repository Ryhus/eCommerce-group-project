import { useState } from "react";
import { PiTrash } from "react-icons/pi";
import { Link } from "react-router-dom";

import type { CartItem } from "../../../services/cartService/types";
import { IconButton } from "../../common/IconButton/IconButton";
import { useCart } from "../../context/useCart";
import { QuantitySelector } from "../../Product/QuantitySelector/QuantitySelector";

import "./BasketProductCard.scss";

type BasketProductCardProps = {
  item: CartItem;
};

const moneyFormatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

export function BasketProductCard({ item }: BasketProductCardProps) {
  const { removeCartItem, updateCartQuantity } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (request: () => Promise<void>) => {
    setIsUpdating(true);
    setError(null);
    try {
      await request();
    } catch {
      setError("We couldn't update this item. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const image = item.image ?? "/images/loading.gif";

  return (
    <article aria-label={`${item.name} in cart`} className="basket-item">
      <Link aria-label={`View ${item.name}`} className="basket-item__image-link" to={`/product/${item.productId}`}>
        <img
          alt={item.name}
          onError={(event) => {
            event.currentTarget.src = "/images/loading.gif";
          }}
          src={image}
        />
      </Link>

      <div className="basket-item__content">
        <div className="basket-item__header">
          <Link className="basket-item__name" to={`/product/${item.productId}`}>
            {item.name}
          </Link>
          <IconButton
            className="basket-item__remove"
            disabled={isUpdating}
            icon={<PiTrash />}
            label={`Remove ${item.name} from cart`}
            onClick={() => void update(() => removeCartItem(item.id))}
            size="small"
          />
        </div>

        {item.quantity > 1 && (
          <p className="basket-item__unit-price">{moneyFormatter.format(item.unitPrice.amount / 100)} each</p>
        )}

        <div className="basket-item__footer">
          <strong className="basket-item__line-total">{moneyFormatter.format(item.lineTotal.amount / 100)}</strong>
          <QuantitySelector
            className="basket-item__quantity"
            disabled={isUpdating}
            max={999}
            onChange={(quantity) => void update(() => updateCartQuantity(item.id, quantity))}
            value={item.quantity}
          />
        </div>

        {error && (
          <p className="basket-item__error" role="alert">
            {error}
          </p>
        )}
      </div>
    </article>
  );
}
