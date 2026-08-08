import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DeleteAddressDialog } from "./DeleteAddressDialog";

describe("DeleteAddressDialog", () => {
  it("explains the destructive action and requires explicit confirmation", () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    render(<DeleteAddressDialog addressName="10 Main Street" onCancel={onCancel} onConfirm={onConfirm} />);

    const dialog = screen.getByRole("alertdialog", { name: "Delete address?" });
    expect(dialog).toHaveTextContent("10 Main Street will be permanently removed");

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete address" }));

    expect(onCancel).toHaveBeenCalledOnce();
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("blocks both actions while deletion is pending", () => {
    render(
      <DeleteAddressDialog
        addressName="10 Main Street"
        isDeleting
        onCancel={() => undefined}
        onConfirm={() => undefined}
      />
    );

    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Deleting…" })).toBeDisabled();
  });
});
