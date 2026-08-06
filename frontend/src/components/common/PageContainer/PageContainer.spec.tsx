import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PageContainer } from "./PageContainer";

describe("PageContainer", () => {
  it("renders its content and forwards native div attributes", () => {
    render(
      <PageContainer aria-label="Page content" className="catalog-layout">
        <span>Catalog</span>
      </PageContainer>
    );

    const container = screen.getByLabelText("Page content");

    expect(container).toHaveClass("page-container", "catalog-layout");
    expect(screen.getByText("Catalog")).toBeInTheDocument();
  });
});
