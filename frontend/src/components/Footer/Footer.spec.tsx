import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import Footer from "./Footer";

describe("Footer", () => {
  it("renders the newsletter, real navigation and project information", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "STAY UP TO DATE ABOUT OUR LATEST OFFERS" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Company" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Shop" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Account" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Resources" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sport Gear home" })).toHaveAttribute("href", "/");
    expect(screen.getByText("Demo store · Payments are not processed")).toBeInTheDocument();
  });
});
