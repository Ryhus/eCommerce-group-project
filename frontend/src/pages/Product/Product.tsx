import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import Breadcrumbs, { type Crumb } from "../../components/Breadcrumbs/Breadcrumbs";
import { PageContainer } from "../../components/common/PageContainer/PageContainer";
import { ProductGallery } from "../../components/Product/ProductGallery/ProductGallery";
import { ProductPurchasePanel } from "../../components/Product/ProductPurchasePanel/ProductPurchasePanel";
import { RelatedProducts } from "../../components/Product/RelatedProducts/RelatedProducts";
import { fetchCategoryTrail } from "../../services/categoryService/categoryService";
import type { Category } from "../../services/categoryService/types";
import { fetchProductById, fetchProductPage } from "../../services/productService/productService";
import type { Product } from "../../services/productService/types";
import NotFoundPage from "../NotFound/NotFound";

import "./Product.scss";

function categoryCrumbs(categories: Category[]): Crumb[] {
  const segments: string[] = [];
  return categories.map((category) => {
    segments.push(category.slug);
    return { name: category.name, path: `/catalog/${segments.join("/")}` };
  });
}

export default function ProductPage() {
  const { t } = useTranslation("common");
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [categoryTrail, setCategoryTrail] = useState<Category[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [resolvedRequestKey, setResolvedRequestKey] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const requestKey = `${id ?? "missing"}#${reloadKey}`;
  const isLoading = resolvedRequestKey !== requestKey;
  const visibleProduct = product?.id === id && !isLoading ? product : null;

  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      setProduct(null);
      setCategoryTrail([]);
      setRecommendations([]);
      setNotFound(false);
      setHasError(false);

      if (!id) {
        setNotFound(true);
        setResolvedRequestKey(requestKey);
        return;
      }

      let nextProduct: Product | null;
      try {
        nextProduct = await fetchProductById(id);
      } catch {
        if (!cancelled) {
          setHasError(true);
          setResolvedRequestKey(requestKey);
        }
        return;
      }

      if (cancelled) return;
      if (!nextProduct) {
        setNotFound(true);
        setResolvedRequestKey(requestKey);
        return;
      }

      setProduct(nextProduct);
      setResolvedRequestKey(requestKey);

      const categoryId = nextProduct.categoryIds[0];
      if (!categoryId) return;

      try {
        const nextTrail = await fetchCategoryTrail(categoryId);
        const recommendationCategoryId = nextTrail[0]?.id ?? categoryId;
        const relatedPage = await fetchProductPage({ categoryId: recommendationCategoryId, limit: 5 });
        if (!cancelled) {
          setCategoryTrail(nextTrail);
          setRecommendations(relatedPage.items);
        }
      } catch {
        // Product context is supplementary; the product remains usable if it is unavailable.
      }
    };

    void loadProduct();
    return () => {
      cancelled = true;
    };
  }, [id, requestKey]);

  const breadcrumbs = useMemo<Crumb[]>(() => {
    if (!product) return [];
    return [...categoryCrumbs(categoryTrail), { name: product.name, path: `/product/${product.id}` }];
  }, [categoryTrail, product]);

  if (!isLoading && notFound) return <NotFoundPage />;

  return (
    <PageContainer className="product-page">
      {isLoading ? (
        <div aria-label={t("productPage.loading")} aria-live="polite" className="product-page__status" role="status">
          <span className="product-page__spinner" />
          {t("productPage.loadingProduct")}
        </div>
      ) : hasError ? (
        <div className="product-page__status" role="alert">
          <p>{t("productPage.loadError")}</p>
          <button className="product-page__retry" onClick={() => setReloadKey((key) => key + 1)} type="button">
            {t("productPage.retry")}
          </button>
        </div>
      ) : visibleProduct ? (
        <>
          <Breadcrumbs crumbs={breadcrumbs} />
          <main className="product-page__main">
            <div className="product-page__hero">
              <ProductGallery images={visibleProduct.imgUrls} productName={visibleProduct.name} />
              <ProductPurchasePanel product={visibleProduct} />
            </div>
            <RelatedProducts currentProductId={visibleProduct.id} products={recommendations} />
          </main>
        </>
      ) : null}
    </PageContainer>
  );
}
