import { useEffect, type ReactNode } from "react";
import { PiX } from "react-icons/pi";

import "./FilterDrawer.scss";

type FilterDrawerProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export function FilterDrawer({ children, isOpen, onClose }: FilterDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="filter-drawer__backdrop"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <aside aria-labelledby="filter-drawer-title" aria-modal="true" className="filter-drawer" role="dialog">
        <div className="filter-drawer__header">
          <h2 id="filter-drawer-title">Catalog options</h2>
          <button aria-label="Close catalog options" onClick={onClose} type="button">
            <PiX aria-hidden="true" />
          </button>
        </div>
        <div className="filter-drawer__content">{children}</div>
      </aside>
    </div>
  );
}
