import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../../components/context/useAuth";
import { useCart } from "../../components/context/useCart";
import { signIn } from "../../services/customerService/customerService";

import LoginPage from "./Login";

vi.mock("../../components/context/useAuth", () => ({ useAuth: vi.fn() }));
vi.mock("../../components/context/useCart", () => ({ useCart: vi.fn() }));
vi.mock("../../services/customerService/customerService", () => ({ signIn: vi.fn() }));

const signInMock = vi.mocked(signIn);
const refreshUser = vi.fn();
const setNewCart = vi.fn();

function CurrentPath() {
  return <output data-testid="current-path">{useLocation().pathname}</output>;
}

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <LoginPage />
      <CurrentPath />
    </MemoryRouter>
  );
}

function fillCredentials() {
  fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), {
    target: { value: "shopper@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password" } });
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false, refreshUser } as never);
    vi.mocked(useCart).mockReturnValue({ setNewCart } as never);
    refreshUser.mockResolvedValue(null);
  });

  it("presents a labelled login form without the removed security message", () => {
    renderLogin();

    expect(screen.getByRole("heading", { level: 1, name: "Welcome back" })).toBeVisible();
    expect(screen.getByRole("form", { name: "Login" })).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Email address" })).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute("autocomplete", "current-password");
    expect(document.querySelector("#login-email-error")).toBeEmptyDOMElement();
    expect(document.querySelector("#login-password-error")).toBeEmptyDOMElement();
    expect(screen.queryByText(/Secure sign-in/i)).not.toBeInTheDocument();
  });

  it("focuses the first invalid field without calling the API", () => {
    renderLogin();

    fireEvent.submit(screen.getByRole("form", { name: "Login" }));

    expect(screen.getByText(/must contain an '@' symbol/i)).toBeVisible();
    expect(screen.getByText("Enter your password.")).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Email address" })).toHaveFocus();
    expect(signInMock).not.toHaveBeenCalled();
  });

  it("switches between hidden and visible password states", () => {
    renderLogin();

    const password = screen.getByLabelText("Password");
    expect(password).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide password" })).toHaveAttribute("aria-pressed", "true");
  });

  it("logs in, restores the cart and redirects home", async () => {
    const cart = { id: "cart-id" };
    signInMock.mockResolvedValue({ cart } as never);
    renderLogin();
    fillCredentials();

    fireEvent.submit(screen.getByRole("form", { name: "Login" }));

    await waitFor(() => expect(signInMock).toHaveBeenCalledWith("shopper@example.com", "password"));
    expect(setNewCart).toHaveBeenCalledWith(cart);
    expect(refreshUser).toHaveBeenCalledOnce();
    expect(screen.getByTestId("current-path")).toHaveTextContent("/");
  });

  it("disables submission while login is pending", async () => {
    let resolveLogin: (value: Awaited<ReturnType<typeof signIn>>) => void = () => undefined;
    signInMock.mockReturnValue(
      new Promise((resolve) => {
        resolveLogin = resolve;
      })
    );
    renderLogin();
    fillCredentials();

    fireEvent.submit(screen.getByRole("form", { name: "Login" }));

    expect(screen.getByRole("button", { name: "Logging in…" })).toBeDisabled();

    await act(async () => resolveLogin({ cart: { id: "cart-id" } } as never));
  });

  it("shows a clear error when authentication fails", async () => {
    signInMock.mockRejectedValue(new Error("Unauthorized"));
    renderLogin();
    fillCredentials();

    fireEvent.submit(screen.getByRole("form", { name: "Login" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Wrong email or password. Please try again.");
    expect(screen.getByRole("button", { name: "Log in" })).toBeEnabled();
  });
});
