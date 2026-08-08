import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuth } from "../../components/context/useAuth";
import { useCart } from "../../components/context/useCart";
import { signUp } from "../../services/customerService/customerService";

import RegistrationPage from "./Registration";

vi.mock("../../components/context/useAuth", () => ({ useAuth: vi.fn() }));
vi.mock("../../components/context/useCart", () => ({ useCart: vi.fn() }));
vi.mock("../../services/customerService/customerService", () => ({ signUp: vi.fn() }));

const signUpMock = vi.mocked(signUp);
const refreshUser = vi.fn();
const setNewCart = vi.fn();

function CurrentPath() {
  return <output data-testid="current-path">{useLocation().pathname}</output>;
}

function renderRegistration() {
  return render(
    <MemoryRouter initialEntries={["/registration"]}>
      <RegistrationPage />
      <CurrentPath />
    </MemoryRouter>
  );
}

function fillAccountStep() {
  fireEvent.change(screen.getByRole("textbox", { name: "First name" }), { target: { value: "John" } });
  fireEvent.change(screen.getByRole("textbox", { name: "Last name" }), { target: { value: "Doe" } });
  fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), {
    target: { value: "john@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "Password1!" } });
  fireEvent.change(screen.getByLabelText("Confirm password"), { target: { value: "Password1!" } });
}

function continueToPersonalStep() {
  fillAccountStep();
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
}

function continueToAddressStep() {
  continueToPersonalStep();
  fireEvent.change(screen.getByLabelText("Date of birth"), { target: { value: "1990-01-01" } });
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
}

function fillAddressStep() {
  fireEvent.change(screen.getByRole("textbox", { name: "Street address" }), {
    target: { value: "10 Main Street" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: "City" }), { target: { value: "Berlin" } });
  fireEvent.change(screen.getByRole("textbox", { name: "Postal code" }), { target: { value: "10115" } });
  fireEvent.change(screen.getByRole("combobox", { name: "Country" }), { target: { value: "DE" } });
}

describe("RegistrationPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false, refreshUser } as never);
    vi.mocked(useCart).mockReturnValue({ setNewCart } as never);
    refreshUser.mockResolvedValue(null);
  });

  it("starts with an accessible account step and reserved error regions", () => {
    renderRegistration();

    expect(screen.getByRole("heading", { level: 1, name: "Create your account" })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Registration progress" })).toBeVisible();
    expect(screen.getByText("Step 1 of 3")).toBeVisible();
    expect(screen.getByRole("form", { name: "Create your Sport Gear account" })).toBeVisible();
    expect(document.querySelector("#registration-email-error")).toBeEmptyDOMElement();
    expect(document.querySelector("#registration-password-error")).toBeEmptyDOMElement();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("validates only the current step and focuses its first invalid field", async () => {
    renderRegistration();

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByText("First name is required.")).toBeVisible();
    expect(screen.queryByText("Date of birth is required.")).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("textbox", { name: "First name" })).toHaveFocus());
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it("controls password and confirmation visibility independently", () => {
    renderRegistration();

    const password = screen.getByLabelText("Password");
    const confirmation = screen.getByLabelText("Confirm password");
    const visibilityButtons = screen.getAllByRole("button", { name: "Show password" });

    fireEvent.click(visibilityButtons[0]);
    expect(password).toHaveAttribute("type", "text");
    expect(confirmation).toHaveAttribute("type", "password");

    fireEvent.click(visibilityButtons[1]);
    expect(confirmation).toHaveAttribute("type", "text");
  });

  it("moves between steps without losing entered account data", () => {
    renderRegistration();
    continueToPersonalStep();

    expect(screen.getByText("Step 2 of 3")).toBeVisible();
    expect(screen.getByRole("heading", { level: 2, name: "A little about you" })).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByRole("textbox", { name: "Email address" })).toHaveValue("john@example.com");
  });

  it("submits all steps, restores the cart and redirects home", async () => {
    const cart = { id: "cart-id" };
    signUpMock.mockResolvedValue({ cart } as never);
    renderRegistration();
    continueToAddressStep();
    fillAddressStep();
    fireEvent.click(screen.getByRole("checkbox", { name: "Use as default billing and shipping address" }));

    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() =>
      expect(signUpMock).toHaveBeenCalledWith(
        "john@example.com",
        "Password1!",
        "John",
        "Doe",
        "1990-01-01",
        [{ streetName: "10 Main Street", city: "Berlin", postalCode: "10115", country: "DE" }],
        true
      )
    );
    expect(setNewCart).toHaveBeenCalledWith(cart);
    expect(refreshUser).toHaveBeenCalledOnce();
    expect(screen.getByTestId("current-path")).toHaveTextContent("/");
  });

  it("disables navigation while account creation is pending", async () => {
    let resolveRegistration: (value: Awaited<ReturnType<typeof signUp>>) => void = () => undefined;
    signUpMock.mockReturnValue(
      new Promise((resolve) => {
        resolveRegistration = resolve;
      })
    );
    renderRegistration();
    continueToAddressStep();
    fillAddressStep();

    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(screen.getByRole("button", { name: "Creating account…" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Back" })).toBeDisabled();

    await act(async () => resolveRegistration({ cart: { id: "cart-id" } } as never));
  });

  it("keeps the final step visible and shows a clear API error", async () => {
    signUpMock.mockRejectedValue(new Error("Conflict"));
    renderRegistration();
    continueToAddressStep();
    fillAddressStep();

    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "We couldn't create your account. Please review your details and try again."
    );
    expect(screen.getByText("Step 3 of 3")).toBeVisible();
    expect(screen.getByRole("button", { name: "Create account" })).toBeEnabled();
  });
});
