import { useTranslation } from "react-i18next";

import type { Product } from "../../services/productService/types";
import Paragraph from "../common/paragraph/paragraph";
import ProductCard, { type ProductCardVariant } from "../productCard/productCard";

import "./ProductList.scss";

type ProductListProps = {
  products: Product[];
  className?: string;
  variant?: ProductCardVariant;
};

const ProductList = ({ products, className = "", variant = "catalog" }: ProductListProps) => {
  const { t } = useTranslation("common");

  if (!products.length) {
    return <Paragraph text={t("productCard.noProducts")} className="product-list__empty" />;
  }

  return (
    <ul className={`product-list ${className}`}>
      {products.map((item) => (
        <li className="product-list__item" key={item.id}>
          <ProductCard
            currentPrice={Number(item.currentPrice)}
            description={item.description}
            id={item.id}
            imgUrl={item.imgUrls[0] || ""}
            name={item.name}
            oldPrice={Number(item.oldPrice)}
            variant={variant}
          />
        </li>
      ))}
    </ul>
  );
};

export default ProductList;
