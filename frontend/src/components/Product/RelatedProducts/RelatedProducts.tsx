import { useTranslation } from "react-i18next";

import type { Product } from "../../../services/productService/types";
import ProductList from "../../productList/ProductList";

import "./RelatedProducts.scss";

type RelatedProductsProps = {
  currentProductId: string;
  products: Product[];
};

export function RelatedProducts({ currentProductId, products }: RelatedProductsProps) {
  const { t } = useTranslation("common");
  const relatedProducts = products.filter((product) => product.id !== currentProductId).slice(0, 4);
  if (!relatedProducts.length) return null;

  return (
    <section aria-labelledby="related-products-title" className="related-products">
      <h2 id="related-products-title">{t("relatedProducts.heading")}</h2>
      <ProductList className="related-products__list" products={relatedProducts} variant="showcase" />
    </section>
  );
}
