import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import i18n from "../../../i18n/i18n";
import { subscribeToNewsletter } from "../../../services/newsletterService/newsletterService";

import NewsletterSignup from "./NewsletterSignup";

vi.mock("../../../services/newsletterService/newsletterService", () => ({
  subscribeToNewsletter: vi.fn(),
}));

const subscribeMock = vi.mocked(subscribeToNewsletter);

describe("NewsletterSignup", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("normalizes and submits a valid email address", async () => {
    subscribeMock.mockResolvedValue({
      email: "shopper@example.com",
      subscribedAt: "2026-08-06T20:00:00.000Z",
    });
    render(<NewsletterSignup />);

    fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), {
      target: { value: "  Shopper@Example.com  " },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Newsletter subscription" }));

    await waitFor(() => expect(subscribeMock).toHaveBeenCalledWith("shopper@example.com"));
    expect(await screen.findByRole("status")).toHaveTextContent("You're subscribed");
    expect(screen.getByRole("textbox", { name: "Email address" })).toHaveValue("");
  });

  it("shows validation feedback without calling the API", () => {
    render(<NewsletterSignup />);

    fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), {
      target: { value: "not-an-email" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Newsletter subscription" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email address");
    expect(subscribeMock).not.toHaveBeenCalled();
  });

  it("shows an error when the subscription request fails", async () => {
    subscribeMock.mockRejectedValue(new Error("Network error"));
    render(<NewsletterSignup />);

    fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), {
      target: { value: "shopper@example.com" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Newsletter subscription" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Unable to subscribe right now");
  });

  it("updates controls and visible feedback when the language changes", async () => {
    subscribeMock.mockResolvedValue({
      email: "shopper@example.com",
      subscribedAt: "2026-08-06T20:00:00.000Z",
    });
    render(<NewsletterSignup />);

    fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), {
      target: { value: "shopper@example.com" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Newsletter subscription" }));
    expect(await screen.findByRole("status")).toHaveTextContent("You're subscribed");

    await act(async () => {
      await i18n.changeLanguage("ru");
    });

    expect(screen.getByRole("heading", { name: "УЗНАВАЙТЕ ПЕРВЫМИ О НАШИХ НОВЫХ ПРЕДЛОЖЕНИЯХ" })).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Электронная почта" })).toHaveAttribute(
      "placeholder",
      "Введите электронную почту"
    );
    expect(screen.getByRole("status")).toHaveTextContent("Вы подписались на новости Sport Gear.");
  });
});
