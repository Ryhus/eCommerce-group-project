import { useState } from "react";
import { PiTrash } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import type { CartItem } from "../../../services/cartService/types";
import { formatMoney } from "../../../utils/formatMoney";
import { IconButton } from "../../common/IconButton/IconButton";
import { useCart } from "../../context/useCart";
import { QuantitySelector } from "../../Product/QuantitySelector/QuantitySelector";

import "./BasketProductCard.scss";

type BasketProductCardProps = {
  item: CartItem;
};

export function BasketProductCard({ item }: BasketProductCardProps) {
  const { t, i18n } = useTranslation("common");
  const { removeCartItem, updateCartQuantity } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasError, setHasError] = useState(false);
  const language = i18n.resolvedLanguage ?? i18n.language;

  const update = async (request: () => Promise<void>) => {
    setIsUpdating(true);
    setHasError(false);
    try {
      await request();
    } catch {
      setHasError(true);
    } finally {
      setIsUpdating(false);
    }
  };

  const image = item.image ?? "/images/loading.gif";

  return (
    <article aria-label={t("basketItem.region", { name: item.name })} className="basket-item">
      <Link
        aria-label={t("basketItem.view", { name: item.name })}
        className="basket-item__image-link"
        to={`/product/${item.productId}`}
      >
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
            label={t("basketItem.remove", { name: item.name })}
            onClick={() => void update(() => removeCartItem(item.id))}
            size="small"
          />
        </div>

        {item.quantity > 1 && (
          <p className="basket-item__unit-price">
            {t("basketItem.each", { price: formatMoney(item.unitPrice.amount, language) })}
          </p>
        )}

        <div className="basket-item__footer">
          <strong className="basket-item__line-total">{formatMoney(item.lineTotal.amount, language)}</strong>
          <QuantitySelector
            className="basket-item__quantity"
            disabled={isUpdating}
            max={999}
            onChange={(quantity) => void update(() => updateCartQuantity(item.id, quantity))}
            value={item.quantity}
          />
        </div>

        {hasError && (
          <p className="basket-item__error" role="alert">
            {t("basketItem.updateError")}
          </p>
        )}
      </div>
    </article>
  );
}
