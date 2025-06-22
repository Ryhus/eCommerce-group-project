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
        <img
          src={imgUrl || "/images/loading.gif"}
          alt={altText || name}
          className="product-card__img"
          onError={(e) => {
            e.currentTarget.src = "/images/loading.gif";
          }}
        />
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
