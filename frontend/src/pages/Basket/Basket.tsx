import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { BasketProductList } from "../../components/Basket/BasketProductList/BasketProductList";
import OrderSummary from "../../components/Basket/OrderSummary/OrderSummary";
import { PageContainer } from "../../components/common/PageContainer/PageContainer";
import { useCart } from "../../components/context/useCart";

import "./BasketPageStyles.scss";

export default function BasketPage() {
  const { t } = useTranslation("common");
  const { cart, cartError, isCartLoading, refreshCart } = useCart();
  const hasItems = Boolean(cart?.items.length);

  return (
    <PageContainer className="basket-page">
      <Breadcrumbs crumbs={[{ name: t("basketPage.breadcrumb"), path: "/basket" }]} includeCatalog={false} />
      <main aria-labelledby="cart-title" className="basket-page__main">
        <h1 id="cart-title">{t("basketPage.title")}</h1>

        {isCartLoading ? (
          <div aria-live="polite" className="basket-page__status" role="status">
            <span className="basket-page__spinner" />
            {t("basketPage.loading")}
          </div>
        ) : cartError ? (
          <div className="basket-page__status" role="alert">
            <p>{t("basketPage.loadError")}</p>
            <button className="basket-page__retry" onClick={() => void refreshCart()} type="button">
              {t("basketPage.retry")}
            </button>
          </div>
        ) : (
          <div className={`basket-page__content${hasItems ? "" : " basket-page__content--empty"}`}>
            <BasketProductList />
            {hasItems && <OrderSummary />}
          </div>
        )}
      </main>
    </PageContainer>
  );
}
import { useTranslation } from "react-i18next";
