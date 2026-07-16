import React, { useState, useRef, useEffect } from "react";
import "./Sorting.scss";

export type SortOption = "default" | "price asc" | "price desc" | "name asc" | "name desc";

export interface SortingProps {
  currentSort: SortOption;
  onSortChange: (newSort: SortOption) => void;
}

const LABELS: Record<SortOption, string> = {
  default: "Most relevant",
  "price asc": "Price low to hight",
  "price desc": "Price hight to low",
  "name asc": "Name A to Z",
  "name desc": "Name Z to A",
};

export const Sorting: React.FC<SortingProps> = ({ currentSort, onSortChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleOptionClick = (option: SortOption) => {
    setOpen(false);
    if (option !== currentSort) {
      onSortChange(option);
    }
  };

  return (
    <div className="sorting" ref={dropdownRef}>
      <button type="button" className="toggle" onClick={() => setOpen((prev) => !prev)}>
        Sort: {LABELS[currentSort]} <span className="caret">⋁</span>
      </button>
      {open && (
        <ul className="sorting-dropdown">
          {(Object.keys(LABELS) as SortOption[]).map((opt) => (
            <li key={opt}>
              <button type="button" className="option" onClick={() => handleOptionClick(opt)}>
                {LABELS[opt]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sorting;
