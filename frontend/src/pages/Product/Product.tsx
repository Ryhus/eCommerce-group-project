import { useEffect, useMemo, useState } from "react";
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
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [categoryTrail, setCategoryTrail] = useState<Category[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      setProduct(null);
      setCategoryTrail([]);
      setRecommendations([]);
      setIsLoading(true);
      setNotFound(false);
      setError(null);

      if (!id) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      let nextProduct: Product | null;
      try {
        nextProduct = await fetchProductById(id);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load this product.");
          setIsLoading(false);
        }
        return;
      }

      if (cancelled) return;
      if (!nextProduct) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setProduct(nextProduct);
      setIsLoading(false);

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
  }, [id, reloadKey]);

  const breadcrumbs = useMemo<Crumb[]>(() => {
    if (!product) return [];
    return [...categoryCrumbs(categoryTrail), { name: product.name, path: `/product/${product.id}` }];
  }, [categoryTrail, product]);

  if (notFound) return <NotFoundPage />;

  return (
    <PageContainer className="product-page">
      {isLoading ? (
        <div aria-live="polite" className="product-page__status" role="status">
          <span className="product-page__spinner" />
          Loading product…
        </div>
      ) : error ? (
        <div className="product-page__status" role="alert">
          <p>We couldn't load this product. {error}</p>
          <button className="product-page__retry" onClick={() => setReloadKey((key) => key + 1)} type="button">
            Try again
          </button>
        </div>
      ) : product ? (
        <>
          <Breadcrumbs crumbs={breadcrumbs} />
          <main className="product-page__main">
            <div className="product-page__hero">
              <ProductGallery images={product.imgUrls} productName={product.name} />
              <ProductPurchasePanel product={product} />
            </div>
            <RelatedProducts currentProductId={product.id} products={recommendations} />
          </main>
        </>
      ) : null}
    </PageContainer>
  );
}
