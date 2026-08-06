import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { AnnouncementBar } from "./AnnouncementBar";

describe("AnnouncementBar", () => {
  it("renders the promotion and links to registration", () => {
    render(
      <MemoryRouter>
        <AnnouncementBar />
      </MemoryRouter>
    );

    const announcement = screen.getByRole("complementary", {
      name: "Promotional announcement",
    });
    const signUpLink = screen.getByRole("link", { name: "Sign Up Now" });

    expect(announcement).toHaveTextContent("Sign up and get 20% off to your first order.");
    expect(signUpLink).toHaveAttribute("href", "/sign-up");
  });

  it("can be dismissed", () => {
    render(
      <MemoryRouter>
        <AnnouncementBar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Dismiss promotion" }));

    expect(screen.queryByRole("complementary", { name: "Promotional announcement" })).not.toBeInTheDocument();
  });
});
