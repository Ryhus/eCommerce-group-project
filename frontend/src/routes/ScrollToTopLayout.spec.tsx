import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ScrollToTopLayout } from "./ScrollToTopLayout";

function NavigationControls() {
  const navigate = useNavigate();

  return (
    <button type="button" onClick={() => navigate("/basket")}>
      Open basket
    </button>
  );
}

describe("ScrollToTopLayout", () => {
  const scrollTo = vi.fn();

  beforeEach(() => {
    scrollTo.mockReset();
    Object.defineProperty(window, "scrollTo", { configurable: true, value: scrollTo, writable: true });
  });

  it("scrolls to the top when the route changes", async () => {
    render(
      <MemoryRouter initialEntries={["/catalog"]}>
        <Routes>
          <Route element={<ScrollToTopLayout />}>
            <Route element={<NavigationControls />} path="*" />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(scrollTo).toHaveBeenCalledTimes(1));
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 0, left: 0, behavior: "auto" });

    fireEvent.click(screen.getByRole("button", { name: "Open basket" }));

    await waitFor(() => expect(scrollTo).toHaveBeenCalledTimes(2));
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 0, left: 0, behavior: "auto" });
  });
});
