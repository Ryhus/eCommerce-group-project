import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import i18n from "../../../i18n/i18n";

import { Pagination } from "./Pagination";

describe("Pagination", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("moves between pages and marks the current page", () => {
    const onPageChange = vi.fn();

    render(<Pagination currentPage={2} onPageChange={onPageChange} pageSize={6} totalItems={18} />);

    expect(screen.getByRole("button", { name: "Go to page 2" })).toHaveAttribute("aria-current", "page");

    fireEvent.click(screen.getByRole("button", { name: "Previous page" }));
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    fireEvent.click(screen.getByRole("button", { name: "Go to page 3" }));

    expect(onPageChange.mock.calls).toEqual([[1], [3], [3]]);
  });

  it("hides when all products fit on one page", () => {
    const { container } = render(<Pagination currentPage={1} onPageChange={vi.fn()} pageSize={6} totalItems={6} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("localizes navigation and generated page labels", async () => {
    await i18n.changeLanguage("ru");

    render(<Pagination currentPage={2} onPageChange={vi.fn()} pageSize={6} totalItems={18} />);

    expect(screen.getByRole("navigation", { name: "Страницы каталога" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Предыдущая страница" })).toHaveTextContent("Назад");
    expect(screen.getByRole("button", { name: "Перейти на страницу 2" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Следующая страница" })).toHaveTextContent("Вперёд");
  });
});
