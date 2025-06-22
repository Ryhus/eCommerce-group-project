import React from "react";
import { useEffect, useState } from "react";
import Paragraph from "../common/paragraph/paragraph";
import Button from "../common/button/button";
import { useCart } from "../context/useCart";
import "./productCard.scss";

type ProductCardProps = {
  id: string;
  name: string;
  description?: string;
  onClick: () => void;
  imgUrl: string;
  currentPrice: number; //in cents
  oldPrice: number; //in cents
  altText?: string;
  className?: string;
};

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description = "",
  onClick,
  imgUrl,
  currentPrice,
  oldPrice,
  altText = name,
  className = "",
}) => {
  let discount: number = 0;
  if (oldPrice > currentPrice) {
    discount = Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
  }
  let shortDescription = description;
  if (description && description.length > 50) {
    shortDescription = description.slice(0, 47).concat("...");
  }
  if (imgUrl === "") imgUrl = "";

  const [productInCart, setProductInCart] = useState(false);
  const { cart, addToCart } = useCart();

  useEffect(() => {
    if (cart && id) {
      setProductInCart(cart.lineItems.some((item) => item.productId === id));
    }
  }, [cart, id]);

  return (
    <div className={`product-card ${className}`} id={id} onClick={onClick}>
      <div className="product-card__img-wrapper">
        {imgUrl ? (
          <img src={imgUrl} alt={altText} className="product-card__img" />
        ) : (
          <svg
            className="product-card__img-placeholder"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 344 405"
            height="250"
            fill="none"
          >
            <path
              d="M277 389.5C271.579 306.33 270.559 255.236 271.5 158L285.5 176.5C310.635 169.356 323.107 162.776 342.5 146.5C321.936 95.5935 310.22 65.8516 294 43C269.282 28.8028 245.885 20.0256 211.5 5L207.5 1C178.568 14.3124 162.661 15.0307 135 1L131.5 5C90.2078 24.9976 66.2063 31.2995 55.5 43C42.5125 54.6489 29.7184 81.5541 1.5 149.5C36.0193 168.69 53.1848 177.231 71.5 180L83.5 158V392C95 407.5 268 408.5 277 389.5Z"
              stroke="#888888"
            />
          </svg>
        )}
      </div>
      <div className="product-card__info">
        <Paragraph text={name} className="product-card__name" />
        {description && <Paragraph text={shortDescription} className="product-card__description" />}
        <div className="product-card__prices">
          <Paragraph text={`${(currentPrice / 100).toFixed(2)}€`} className="product-card__current-price" />
          {oldPrice > currentPrice && discount && (
            <>
              <Paragraph text={`${(oldPrice / 100).toFixed(2)}€`} className="product-card__old-price" />
              <div className="product-card__discount">-{discount}%</div>
            </>
          )}
        </div>
      </div>
      <Button
        text={productInCart ? "In Cart" : "Add to Cart"}
        disabled={productInCart}
        className="btn-medium product-card__add-to-cart"
        onClick={(e) => {
          e.stopPropagation();
          if (!productInCart) addToCart(id);
        }}
      />
    </div>
  );
};

export default ProductCard;
