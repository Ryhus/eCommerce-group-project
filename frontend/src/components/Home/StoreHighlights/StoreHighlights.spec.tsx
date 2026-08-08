import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import i18n from "../../../i18n/i18n";

import StoreHighlights from "./StoreHighlights";

const scrollBy = vi.fn();

describe("StoreHighlights", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
    scrollBy.mockReset();
    Object.defineProperty(HTMLElement.prototype, "scrollBy", {
      configurable: true,
      value: scrollBy,
    });
  });

  it("presents verifiable store advantages and scroll controls", () => {
    render(<StoreHighlights />);

    expect(screen.getByRole("region", { name: "WHY SPORT GEAR" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Store advantages" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText("Server-priced catalog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next advantages" }));
    expect(scrollBy).toHaveBeenCalledWith({ behavior: "smooth", left: 360 });

    fireEvent.click(screen.getByRole("button", { name: "Previous advantages" }));
    expect(scrollBy).toHaveBeenCalledWith({ behavior: "smooth", left: -360 });
  });

  it("localizes cards, list, and carousel controls", async () => {
    await i18n.changeLanguage("ru");

    render(<StoreHighlights />);

    expect(screen.getByRole("region", { name: "ПОЧЕМУ SPORT GEAR" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Преимущества магазина" })).toBeInTheDocument();
    expect(screen.getByText("Цены рассчитывает сервер")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Следующие преимущества" }));
    expect(scrollBy).toHaveBeenCalledWith({ behavior: "smooth", left: 360 });
  });
});
