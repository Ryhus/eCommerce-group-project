import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import i18n from "../../i18n/i18n";

import ProductList from "./ProductList";

vi.mock("../productCard/productCard", () => ({ default: () => <article>Product</article> }));

describe("ProductList", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("localizes its empty state", async () => {
    await i18n.changeLanguage("ru");

    render(<ProductList products={[]} />);

    expect(screen.getByText("Товары не найдены.")).toBeVisible();
  });
});
