import { PiCaretRight, PiSlidersHorizontal } from "react-icons/pi";
import { Link } from "react-router-dom";

import "./CategoryFilter.scss";

export type CategoryFilterItem = {
  id: string;
  name: string;
  to: string;
  isActive?: boolean;
};

type CategoryFilterProps = {
  items: CategoryFilterItem[];
  onNavigate?: () => void;
  className?: string;
};

export function CategoryFilter({ className = "", items, onNavigate }: CategoryFilterProps) {
  return (
    <section aria-labelledby="category-filter-title" className={`category-filter ${className}`.trim()}>
      <div className="category-filter__header">
        <h2 id="category-filter-title">Categories</h2>
        <PiSlidersHorizontal aria-hidden="true" />
      </div>

      <ul className="category-filter__list">
        <li>
          <Link className="category-filter__link" onClick={onNavigate} to="/catalog">
            <span>All products</span>
            <PiCaretRight aria-hidden="true" />
          </Link>
        </li>
        {items.map(({ id, isActive, name, to }) => (
          <li key={id}>
            <Link
              aria-current={isActive ? "page" : undefined}
              className="category-filter__link"
              onClick={onNavigate}
              to={to}
            >
              <span>{name}</span>
              <PiCaretRight aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
