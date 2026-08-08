import { PiShoppingCart } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useCart } from "../../context/useCart";
import { BasketProductCard } from "../BasketProductCard/BasketProductCard";

import "./BasketProductList.scss";

export function BasketProductList() {
  const { t } = useTranslation("common");
  const { cart } = useCart();
  const items = cart?.items ?? [];

  if (!items.length) {
    return (
      <section aria-labelledby="empty-cart-title" className="basket-empty">
        <PiShoppingCart aria-hidden="true" />
        <h2 id="empty-cart-title">{t("basketList.emptyTitle")}</h2>
        <p>{t("basketList.emptyDescription")}</p>
        <Link className="basket-empty__link" to="/catalog">
          {t("basketList.browseProducts")}
        </Link>
      </section>
    );
  }

  return (
    <section aria-label={t("basketList.items")} className="basket-list">
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
