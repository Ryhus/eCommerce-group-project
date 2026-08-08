import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { formatMoney } from "../../utils/formatMoney";
import Button from "../common/button/button";
import { useCart } from "../context/useCart";

import "./productCard.scss";

export type ProductCardVariant = "catalog" | "showcase";

type ProductCardProps = {
  id: string;
  name: string;
  description?: string;
  imgUrl: string;
  currentPrice: number;
  oldPrice: number;
  altText?: string;
  className?: string;
  variant?: ProductCardVariant;
};

const ProductCard = ({
  id,
  name,
  description = "",
  imgUrl,
  currentPrice,
  oldPrice,
  altText = name,
  className = "",
  variant = "catalog",
}: ProductCardProps) => {
  const { i18n, t } = useTranslation("common");
  const { cart, addToCart } = useCart();
  const productInCart = cart?.items.some((item) => item.productId === id) ?? false;
  const discount = oldPrice > currentPrice ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : 0;
  const shortDescription = description.length > 50 ? `${description.slice(0, 47)}...` : description;
  const cardClassName = `product-card product-card--${variant} ${className}`.trim();
  const language = i18n.resolvedLanguage ?? i18n.language;

  return (
    <article className={cardClassName}>
      <Link aria-label={t("productCard.view", { name })} className="product-card__link" to={`/product/${id}`}>
        <div className="product-card__img-wrapper">
          <img
            alt={altText}
            className="product-card__img"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = "/images/loading.gif";
            }}
            src={imgUrl || "/images/loading.gif"}
          />
        </div>

        <div className="product-card__info">
          <h3 className="product-card__name">{name}</h3>
          {description && variant === "catalog" && <p className="product-card__description">{shortDescription}</p>}
          <div className="product-card__prices">
            <span className="product-card__current-price">{formatMoney(currentPrice, language)}</span>
            {discount > 0 && (
              <>
                <span className="product-card__old-price">{formatMoney(oldPrice, language)}</span>
                <span className="product-card__discount">-{discount}%</span>
              </>
            )}
          </div>
        </div>
      </Link>

      {variant === "catalog" && (
        <Button
          className="btn-medium product-card__add-to-cart"
          disabled={productInCart}
          onClick={() => {
            if (!productInCart) void addToCart(id);
          }}
          text={productInCart ? t("productCard.inCart") : t("productCard.addToCart")}
        />
      )}
    </article>
  );
};

export default ProductCard;
