import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { BasketProductList } from "../../components/Basket/BasketProductList/BasketProductList";
import OrderSummary from "../../components/Basket/OrderSummary/OrderSummary";
import { PageContainer } from "../../components/common/PageContainer/PageContainer";
import { useCart } from "../../components/context/useCart";

import "./BasketPageStyles.scss";

export default function BasketPage() {
  const { cart, cartError, isCartLoading, refreshCart } = useCart();
  const hasItems = Boolean(cart?.items.length);

  return (
    <PageContainer className="basket-page">
      <Breadcrumbs crumbs={[{ name: "Cart", path: "/basket" }]} includeCatalog={false} />
      <main aria-labelledby="cart-title" className="basket-page__main">
        <h1 id="cart-title">Your cart</h1>

        {isCartLoading ? (
          <div aria-live="polite" className="basket-page__status" role="status">
            <span className="basket-page__spinner" />
            Loading your cart…
          </div>
        ) : cartError ? (
          <div className="basket-page__status" role="alert">
            <p>We couldn't load your cart. {cartError}</p>
            <button className="basket-page__retry" onClick={() => void refreshCart()} type="button">
              Try again
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
