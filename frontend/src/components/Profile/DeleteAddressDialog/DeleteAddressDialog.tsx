import Button from "../../common/button/button";

import "./DeleteAddressDialog.scss";

type DeleteAddressDialogProps = {
  addressName: string;
  error?: string;
  isDeleting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteAddressDialog({
  addressName,
  error = "",
  isDeleting = false,
  onCancel,
  onConfirm,
}: DeleteAddressDialogProps) {
  return (
    <div className="delete-address-dialog__backdrop">
      <div
        aria-describedby="delete-address-description"
        aria-labelledby="delete-address-title"
        aria-modal="true"
        className="delete-address-dialog"
        role="alertdialog"
      >
        <h2 id="delete-address-title">Delete address?</h2>
        <p id="delete-address-description">
          <strong>{addressName}</strong> will be permanently removed from your account.
        </p>

        <div aria-live="polite" className="delete-address-dialog__error">
          {error && <p>{error}</p>}
        </div>

        <div className="delete-address-dialog__actions">
          <Button disabled={isDeleting} onClick={onCancel} text="Cancel" variant="light" />
          <Button disabled={isDeleting} onClick={onConfirm} text={isDeleting ? "Deleting…" : "Delete address"} />
        </div>
      </div>
    </div>
  );
}
