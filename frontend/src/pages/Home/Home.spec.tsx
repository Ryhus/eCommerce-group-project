import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchProducts } from "../../services/productService/productService";
import type { Product } from "../../services/productService/types";
import i18n from "../../i18n/i18n";

import HomePage from "./Home";

vi.mock("../../services/productService/productService", () => ({ fetchProducts: vi.fn() }));
vi.mock("../../components/Home/HomeHero/HomeHero", () => ({ default: () => <div>Hero</div> }));
vi.mock("../../components/Home/ActivityStrip/ActivityStrip", () => ({ default: () => <div>Activities</div> }));
vi.mock("../../components/Home/CategoryShowcase/CategoryShowcase", () => ({ default: () => <div>Categories</div> }));
vi.mock("../../components/Home/StoreHighlights/StoreHighlights", () => ({ default: () => <div>Highlights</div> }));
vi.mock("../../components/Home/HomeProductSection/HomeProductSection", () => ({
  default: ({ title, products }: { title: string; products: Product[] }) => (
    <section data-count={products.length}>{title}</section>
  ),
}));

const products: Product[] = Array.from({ length: 8 }, (_, index) => ({
  id: `product-${index}`,
  slug: `product-${index}`,
  name: `Product ${index}`,
  imgUrls: [],
  categoryIds: [],
  currentPrice: 1000 + index,
  oldPrice: 1000 + index,
}));

describe("HomePage", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
    vi.mocked(fetchProducts).mockReset();
  });

  it("loads one catalog page and divides it into two storefront sections", async () => {
    vi.mocked(fetchProducts).mockResolvedValue(products);
    render(<HomePage />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading the latest gear");

    await waitFor(() => expect(screen.getByText("New arrivals")).toHaveAttribute("data-count", "4"));
    expect(screen.getByText("Gear for every goal")).toHaveAttribute("data-count", "4");
    expect(fetchProducts).toHaveBeenCalledWith({ limit: 8 });
  });

  it("shows a retry action when the catalog request fails", async () => {
    vi.mocked(fetchProducts).mockRejectedValueOnce(new Error("Unavailable")).mockResolvedValueOnce(products);
    render(<HomePage />);

    expect(await screen.findByRole("alert")).toHaveTextContent("couldn't load the product selection");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    await waitFor(() => expect(fetchProducts).toHaveBeenCalledTimes(2));
    expect(await screen.findByText("New arrivals")).toBeInTheDocument();
  });

  it("updates an existing error message when the language changes", async () => {
    vi.mocked(fetchProducts).mockRejectedValue(new Error("Unavailable"));
    render(<HomePage />);

    expect(await screen.findByRole("alert")).toHaveTextContent("couldn't load the product selection");

    await act(async () => {
      await i18n.changeLanguage("de");
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Die Produktauswahl konnte nicht geladen werden");
    expect(screen.getByRole("button", { name: "Erneut versuchen" })).toBeInTheDocument();
    expect(fetchProducts).toHaveBeenCalledTimes(1);
  });
});
