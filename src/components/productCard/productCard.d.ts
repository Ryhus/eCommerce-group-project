import React from "react";
import "./productCard.scss";
type ProductCardProps = {
    id: string;
    name: string;
    description?: string;
    onClick: () => void;
    imgUrl: string;
    currentPrice: number;
    oldPrice: number;
    altText?: string;
    className?: string;
};
declare const ProductCard: React.FC<ProductCardProps>;
export default ProductCard;
