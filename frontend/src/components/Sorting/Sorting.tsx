import { PiCaretDownBold } from "react-icons/pi";
import { useTranslation } from "react-i18next";

import "./Sorting.scss";

export type SortOption = "default" | "price asc" | "price desc" | "name asc" | "name desc";

export interface SortingProps {
  currentSort: SortOption;
  onSortChange: (newSort: SortOption) => void;
  className?: string;
}

const SORT_OPTIONS = [
  { value: "default", labelKey: "sorting.relevance" },
  { value: "price asc", labelKey: "sorting.priceAscending" },
  { value: "price desc", labelKey: "sorting.priceDescending" },
  { value: "name asc", labelKey: "sorting.nameAscending" },
  { value: "name desc", labelKey: "sorting.nameDescending" },
] as const satisfies ReadonlyArray<{ value: SortOption; labelKey: string }>;

export const Sorting = ({ currentSort, onSortChange, className = "" }: SortingProps) => {
  const { t } = useTranslation("common");

  return (
    <label className={`sorting ${className}`.trim()}>
      <span className="sorting__label">{t("sorting.label")}</span>
      <span className="sorting__control">
        <select
          aria-label={t("sorting.control")}
          className="sorting__select"
          onChange={(event) => onSortChange(event.target.value as SortOption)}
          value={currentSort}
        >
          {SORT_OPTIONS.map(({ value, labelKey }) => (
            <option key={value} value={value}>
              {t(labelKey)}
            </option>
          ))}
        </select>
        <PiCaretDownBold aria-hidden="true" className="sorting__icon" />
      </span>
    </label>
  );
};

export default Sorting;
