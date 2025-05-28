import React from "react";
import Paragraph from "../common/paragraph/paragraph";
import "./productCard.scss";

type ProductCardProps = {
  //id: string;
  name: string;
  onClick: () => void;
  imgUrl: string;
  currentPrice: string; // tbc if number or string and if currency is included
  oldPrice: string;
  altText?: string;
  className?: string;
};

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  onClick,
  imgUrl,
  currentPrice,
  oldPrice,
  altText = name,
  className = "",
}) => {
  let discount: number = 0;
  const currentP = parseFloat(currentPrice);
  const oldP = parseFloat(oldPrice);
  if (!isNaN(currentP) && !isNaN(oldP) && oldP > currentP) {
    discount = Math.round(((oldP - currentP) / oldP) * 100);
  }
  return (
    <div className={`product-card ${className}`} onClick={onClick}>
      <div className="product-card__img-wrapper">
        <img src={imgUrl} alt={altText} className="product-card__img" />
      </div>
      <div className="product-card__info">
        <Paragraph text={name} className="product-card__name" />
        <div className="product-card__prices">
          <Paragraph text={currentPrice} className="product-card__current-price" />
          {oldP > currentP && discount && (
            <>
              <Paragraph text={oldPrice} className="product-card__old-price" />
              <div className="product-card__discount">-{discount}%</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
