import React from "react";
import Paragraph from "../common/paragraph/paragraph";
import "./productCard.scss";

type ProductCardProps = {
  id: string;
  name: string;
  onClick: () => void;
  imgUrl: string;
  currentPrice: number; //in centes
  oldPrice: number; //in centes
  altText?: string;
  className?: string;
};

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
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
  return (
    <div className={`product-card ${className}`} id={id} onClick={onClick}>
      <div className="product-card__img-wrapper">
        <img src={imgUrl} alt={altText} className="product-card__img" />
      </div>
      <div className="product-card__info">
        <Paragraph text={name} className="product-card__name" />
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
    </div>
  );
};

export default ProductCard;
