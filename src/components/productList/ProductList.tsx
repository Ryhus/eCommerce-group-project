import React from "react";
import Paragraph from "../common/paragraph/paragraph";
import ProductCard from "../productCard/productCard";
import type { Product } from "../../services/productService/types";
import "./ProductList.scss";
import { useNavigate } from "react-router-dom";

type ProductListProps = {
  products: Product[];
  className?: string;
};

const ProductList: React.FC<ProductListProps> = ({ products, className = "" }) => {
  const navigate = useNavigate();
  if (!products.length) {
    return <Paragraph text="No products found." className="product-list__empty" />;
  }

  return (
    <div className={`product-list ${className}`}>
      {products.map((item) => (
        <ProductCard
          key={item.id}
          id={item.id}
          name={item.name}
          description={item.description}
          imgUrl={item.imgUrls[0] || ""}
          currentPrice={Number(item.currentPrice)}
          oldPrice={Number(item.oldPrice)}
          onClick={() => navigate(`/product/${item.id}`)} //change to product slug for seo-frienfly link address
        />
      ))}
    </div>
  );
};

export default ProductList;
