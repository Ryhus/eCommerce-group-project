import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import i18n from "../../i18n/i18n";
import type { CartResponse } from "../../services/cartService/types";
import { useCart } from "../../components/context/useCart";
import BasketPage from "./Basket";

vi.mock("../../components/context/useCart", () => ({ useCart: vi.fn() }));
vi.mock("../../components/Basket/BasketProductList/BasketProductList", () => ({
  BasketProductList: () => <section>Product list</section>,
}));
vi.mock("../../components/Basket/OrderSummary/OrderSummary", () => ({
  default: () => <aside>Order summary</aside>,
}));

const cart: CartResponse = {
  id: "cart-id",
  items: [
    {
      id: "item-id",
      productId: "product-id",
      variantId: "variant-id",
      name: "Match Football",
      image: null,
      quantity: 1,
      unitPrice: { amount: 3499, currency: "EUR" },
      lineTotal: { amount: 3499, currency: "EUR" },
    },
  ],
  totalQuantity: 1,
  subtotal: { amount: 3499, currency: "EUR" },
  discount: { amount: 0, currency: "EUR" },
  total: { amount: 3499, currency: "EUR" },
  discountCode: null,
};

describe("BasketPage", () => {
  const refreshCart = vi.fn();

  beforeEach(async () => {
    await i18n.changeLanguage("en");
    refreshCart.mockReset();
  });

  it("lays out cart items and the order summary", () => {
    vi.mocked(useCart).mockReturnValue({ cart, cartError: null, isCartLoading: false, refreshCart } as never);
    render(
      <MemoryRouter>
        <BasketPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Your cart" })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveTextContent("HomeCart");
    expect(screen.getByText("Product list")).toBeVisible();
    expect(screen.getByText("Order summary")).toBeVisible();
  });

  it("does not show a zero-value order summary for an empty cart", () => {
    vi.mocked(useCart).mockReturnValue({
      cart: { ...cart, items: [], totalQuantity: 0 },
      cartError: null,
      isCartLoading: false,
      refreshCart,
    } as never);
    render(
      <MemoryRouter>
        <BasketPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Product list")).toBeVisible();
    expect(screen.queryByText("Order summary")).not.toBeInTheDocument();
  });

  it("shows cart loading and supports retry after an error", async () => {
    vi.mocked(useCart).mockReturnValue({ cart: null, cartError: null, isCartLoading: true, refreshCart } as never);
    const { rerender } = render(
      <MemoryRouter>
        <BasketPage />
      </MemoryRouter>
    );
    expect(screen.getByRole("status")).toHaveTextContent("Loading your cart");

    vi.mocked(useCart).mockReturnValue({
      cart: null,
      cartError: "Network unavailable",
      isCartLoading: false,
      refreshCart,
    } as never);
    rerender(
      <MemoryRouter>
        <BasketPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    await waitFor(() => expect(refreshCart).toHaveBeenCalledOnce());
    expect(screen.getByRole("alert")).not.toHaveTextContent("Network unavailable");
  });

  it("localizes the page and its error state", async () => {
    await i18n.changeLanguage("ru");
    vi.mocked(useCart).mockReturnValue({
      cart: null,
      cartError: "Network unavailable",
      isCartLoading: false,
      refreshCart,
    } as never);
    render(
      <MemoryRouter>
        <BasketPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Ваша корзина" })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Навигационная цепочка" })).toHaveTextContent("ГлавнаяКорзина");
    expect(screen.getByRole("alert")).toHaveTextContent("Не удалось загрузить корзину");
    expect(screen.getByRole("button", { name: "Попробовать снова" })).toBeVisible();
  });
});
