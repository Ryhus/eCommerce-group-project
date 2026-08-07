import { PiCaretDownBold } from "react-icons/pi";

import "./Sorting.scss";

export type SortOption = "default" | "price asc" | "price desc" | "name asc" | "name desc";

export interface SortingProps {
  currentSort: SortOption;
  onSortChange: (newSort: SortOption) => void;
  className?: string;
}

const LABELS: Record<SortOption, string> = {
  default: "Most relevant",
  "price asc": "Price: low to high",
  "price desc": "Price: high to low",
  "name asc": "Name: A to Z",
  "name desc": "Name: Z to A",
};

const SORT_OPTIONS = Object.entries(LABELS) as [SortOption, string][];

export const Sorting = ({ currentSort, onSortChange, className = "" }: SortingProps) => {
  return (
    <label className={`sorting ${className}`.trim()}>
      <span className="sorting__label">Sort by:</span>
      <span className="sorting__control">
        <select
          aria-label="Sort products"
          className="sorting__select"
          onChange={(event) => onSortChange(event.target.value as SortOption)}
          value={currentSort}
        >
          {SORT_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <PiCaretDownBold aria-hidden="true" className="sorting__icon" />
      </span>
    </label>
  );
};

export default Sorting;
