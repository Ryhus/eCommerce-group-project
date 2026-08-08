import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ActivityStrip from "../../components/Home/ActivityStrip/ActivityStrip";
import CategoryShowcase from "../../components/Home/CategoryShowcase/CategoryShowcase";
import HomeHero from "../../components/Home/HomeHero/HomeHero";
import HomeProductSection from "../../components/Home/HomeProductSection/HomeProductSection";
import StoreHighlights from "../../components/Home/StoreHighlights/StoreHighlights";
import Button from "../../components/common/button/button";
import { PageContainer } from "../../components/common/PageContainer/PageContainer";
import { fetchProducts } from "../../services/productService/productService";
import type { Product } from "../../services/productService/types";

import "./HomeStyles.scss";

const HOME_PRODUCT_LIMIT = 8;
const HOME_SECTION_SIZE = 4;

export default function HomePage() {
  const { t } = useTranslation("common");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const nextProducts = await fetchProducts({ limit: HOME_PRODUCT_LIMIT });
        if (!cancelled) setProducts(nextProducts);
      } catch {
        if (!cancelled) setHasError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const newArrivals = products.slice(0, HOME_SECTION_SIZE);
  const moreGear = products.slice(HOME_SECTION_SIZE, HOME_PRODUCT_LIMIT);

  return (
    <div className="home-page">
      <HomeHero />
      <ActivityStrip />

      {isLoading && (
        <PageContainer aria-live="polite" className="home-page__feedback" role="status">
          <span className="home-page__loader" />
          {t("home.loading")}
        </PageContainer>
      )}

      {!isLoading && hasError && (
        <PageContainer className="home-page__feedback home-page__feedback--error" role="alert">
          <p>{t("home.loadError")}</p>
          <Button
            className="btn-medium home-page__retry"
            onClick={() => setReloadKey((current) => current + 1)}
            text={t("home.retry")}
          />
        </PageContainer>
      )}

      {!isLoading && !hasError && (
        <>
          {newArrivals.length > 0 && <HomeProductSection products={newArrivals} title={t("home.newArrivals")} />}
          {moreGear.length > 0 && <HomeProductSection products={moreGear} title={t("home.moreGear")} />}
        </>
      )}

      <CategoryShowcase />
      <StoreHighlights />
    </div>
  );
}
