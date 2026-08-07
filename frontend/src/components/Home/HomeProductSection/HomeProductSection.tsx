import { useId, type ComponentPropsWithoutRef } from "react";
import { Link } from "react-router-dom";

import type { Product } from "../../../services/productService/types";
import ProductList from "../../productList/ProductList";
import { H2 } from "../../common/headings/H2";
import { PageContainer } from "../../common/PageContainer/PageContainer";

import "./HomeProductSection.scss";

type HomeProductSectionProps = Omit<ComponentPropsWithoutRef<"section">, "children"> & {
  title: string;
  products: Product[];
  viewAllHref?: string;
};

const HomeProductSection = ({
  title,
  products,
  viewAllHref = "/catalog",
  className = "",
  ...props
}: HomeProductSectionProps) => {
  const titleId = useId();
  const sectionClassName = `home-product-section ${className}`.trim();

  return (
    <section {...props} aria-labelledby={titleId} className={sectionClassName}>
      <PageContainer className="home-product-section__container">
        <H2 className="home-product-section__title" id={titleId} text={title} />
        <ProductList className="home-product-section__list" products={products} variant="showcase" />
        <Link className="home-product-section__view-all" to={viewAllHref}>
          View all
        </Link>
      </PageContainer>
    </section>
  );
};

export default HomeProductSection;
