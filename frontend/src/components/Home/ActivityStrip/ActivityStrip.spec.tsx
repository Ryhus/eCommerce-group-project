import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ActivityStrip from "./ActivityStrip";

describe("ActivityStrip", () => {
  it("presents activity areas without unsupported brand claims", () => {
    render(<ActivityStrip />);

    expect(screen.getByRole("group", { name: "Sport Gear activities" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "Run",
      "Train",
      "Play",
      "Recover",
      "Explore",
    ]);
  });
});
