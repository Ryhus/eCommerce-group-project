import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import i18n from "../../../i18n/i18n";

import StoreHighlights from "./StoreHighlights";

const scrollBy = vi.fn();

describe("StoreHighlights", () => {
  beforeEach(async () => {
    vi.useRealTimers();
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
    const list = screen.getByRole("list", { name: "Store advantages" });
    const cards = list.querySelectorAll("article");
    Object.defineProperty(cards[0], "offsetLeft", { configurable: true, value: 8 });
    Object.defineProperty(cards[1], "offsetLeft", { configurable: true, value: 428 });
    Object.defineProperty(cards[4], "offsetLeft", { configurable: true, value: 1688 });

    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByRole("heading", { name: "Server-priced catalog" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next advantages" }));
    expect(scrollBy).toHaveBeenCalledWith({ behavior: "smooth", left: 420 });

    fireEvent.click(screen.getByRole("button", { name: "Previous advantages" }));
    expect(scrollBy).toHaveBeenCalledWith({ behavior: "smooth", left: -420 });
  });

  it("localizes cards, list, and carousel controls", async () => {
    await i18n.changeLanguage("ru");

    render(<StoreHighlights />);

    expect(screen.getByRole("region", { name: "ПОЧЕМУ SPORT GEAR" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Преимущества магазина" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Цены рассчитывает сервер" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Следующие преимущества" }));
    expect(scrollBy).toHaveBeenCalledWith({ behavior: "smooth", left: 360 });
  });

  it("loops back to the original copy at either end", () => {
    vi.useFakeTimers();
    render(<StoreHighlights />);

    const list = screen.getByRole("list");
    const cards = list.querySelectorAll("article");

    Object.defineProperty(list, "offsetLeft", { configurable: true, value: 32 });
    Object.defineProperty(cards[0], "offsetLeft", { configurable: true, value: 34 });
    Object.defineProperty(cards[1], "offsetLeft", { configurable: true, value: 134 });
    Object.defineProperty(cards[4], "offsetLeft", { configurable: true, value: 434 });
    Object.defineProperty(list, "scrollLeft", { configurable: true, writable: true, value: 2 });

    fireEvent.scroll(list);
    act(() => vi.advanceTimersByTime(100));
    expect(list.scrollLeft).toBe(402);

    list.scrollLeft = 200;
    fireEvent.scroll(list);
    act(() => vi.advanceTimersByTime(100));
    expect(list.scrollLeft).toBe(200);

    list.scrollLeft = 802;
    fireEvent.scroll(list);
    act(() => vi.advanceTimersByTime(100));
    expect(list.scrollLeft).toBe(402);

    list.scrollLeft = 3;
    fireEvent.click(screen.getByRole("button", { name: "Previous advantages" }));
    expect(list.scrollLeft).toBe(403);
    expect(scrollBy).toHaveBeenLastCalledWith({ behavior: "smooth", left: -100 });
  });
});
