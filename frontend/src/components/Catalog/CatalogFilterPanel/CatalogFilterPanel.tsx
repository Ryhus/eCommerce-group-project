import type { ChangeEvent, CSSProperties } from "react";
import { useTranslation } from "react-i18next";

import type { CatalogFilters, ProductFilterState } from "../../../services/productService/types";

import "./CatalogFilterPanel.scss";

type CatalogFilterPanelProps = {
  options: CatalogFilters | null;
  value: ProductFilterState;
  onChange: (value: ProductFilterState) => void;
  onApply: () => void;
  onClear: () => void;
};

const SWATCH_CLASSES: Record<string, string> = {
  black: "catalog-filter-panel__swatch--black",
  blue: "catalog-filter-panel__swatch--blue",
  brown: "catalog-filter-panel__swatch--brown",
  green: "catalog-filter-panel__swatch--green",
  orange: "catalog-filter-panel__swatch--orange",
  red: "catalog-filter-panel__swatch--red",
  white: "catalog-filter-panel__swatch--white",
  yellow: "catalog-filter-panel__swatch--yellow",
};

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function priceLabel(amount: number): string {
  return new Intl.NumberFormat(undefined, { currency: "EUR", maximumFractionDigits: 2, style: "currency" }).format(
    amount / 100
  );
}

export function CatalogFilterPanel({ options, value, onChange, onApply, onClear }: CatalogFilterPanelProps) {
  const { t } = useTranslation("common");

  if (!options) {
    return <p className="catalog-filter-panel__loading">{t("catalogFilters.loading")}</p>;
  }

  const minBound = options.price.min;
  const maxBound = Math.max(options.price.max, minBound);
  const rawMin = value.minPrice ?? minBound;
  const rawMax = value.maxPrice ?? maxBound;
  const clampedMin = Math.min(Math.max(rawMin, minBound), maxBound);
  const clampedMax = Math.min(Math.max(rawMax, minBound), maxBound);
  const selectedMin = Math.min(clampedMin, clampedMax);
  const selectedMax = Math.max(clampedMin, clampedMax);
  const rangeSpan = maxBound - minBound;
  const rangeStart = rangeSpan ? ((selectedMin - minBound) / rangeSpan) * 100 : 0;
  const rangeEnd = rangeSpan ? ((selectedMax - minBound) / rangeSpan) * 100 : 100;
  const hasActiveFilters =
    value.minPrice !== undefined ||
    value.maxPrice !== undefined ||
    value.colors.length > 0 ||
    value.sizes.length > 0 ||
    value.equipmentTypes.length > 0;

  const labelFor = (filterValue: string) =>
    t(`catalogFilters.values.${filterValue}`, { defaultValue: filterValue.replace(/[-_]/g, " ") });

  const updateRange = (event: ChangeEvent<HTMLInputElement>, type: "min" | "max") => {
    const next = Number(event.target.value);
    if (minBound === maxBound) return;

    if (type === "min") {
      const nextMin = Math.min(next, selectedMax - 1);
      onChange({ ...value, minPrice: nextMin === minBound ? undefined : nextMin });
    } else {
      const nextMax = Math.max(next, selectedMin + 1);
      onChange({ ...value, maxPrice: nextMax === maxBound ? undefined : nextMax });
    }
  };

  return (
    <section aria-labelledby="catalog-filters-title" className="catalog-filter-panel">
      <div className="catalog-filter-panel__header">
        <h2 id="catalog-filters-title">{t("catalogFilters.title")}</h2>
        {hasActiveFilters && (
          <button className="catalog-filter-panel__clear-link" onClick={onClear} type="button">
            {t("catalogFilters.clear")}
          </button>
        )}
      </div>

      <fieldset className="catalog-filter-panel__section">
        <legend>{t("catalogFilters.price")}</legend>
        <div
          className="catalog-filter-panel__range"
          style={{ "--range-start": `${rangeStart}%`, "--range-end": `${rangeEnd}%` } as CSSProperties}
        >
          <input
            aria-label={t("catalogFilters.minimumPrice")}
            className="catalog-filter-panel__range-input catalog-filter-panel__range-input--min"
            disabled={minBound === maxBound}
            max={maxBound}
            min={minBound}
            onChange={(event) => updateRange(event, "min")}
            type="range"
            value={selectedMin}
          />
          <input
            aria-label={t("catalogFilters.maximumPrice")}
            className="catalog-filter-panel__range-input catalog-filter-panel__range-input--max"
            disabled={minBound === maxBound}
            max={maxBound}
            min={minBound}
            onChange={(event) => updateRange(event, "max")}
            type="range"
            value={selectedMax}
          />
        </div>
        <div className="catalog-filter-panel__range-values">
          <span>{priceLabel(selectedMin)}</span>
          <span>{priceLabel(selectedMax)}</span>
        </div>
      </fieldset>

      <fieldset className="catalog-filter-panel__section">
        <legend>{t("catalogFilters.colors")}</legend>
        <div className="catalog-filter-panel__swatches">
          {options.colors.map((option) => (
            <button
              aria-label={`${labelFor(option.value)} (${option.count})`}
              aria-pressed={value.colors.includes(option.value)}
              className={`catalog-filter-panel__swatch ${SWATCH_CLASSES[option.value] ?? ""}`.trim()}
              key={option.value}
              onClick={() => onChange({ ...value, colors: toggleValue(value.colors, option.value) })}
              title={labelFor(option.value)}
              type="button"
            >
              <span className="catalog-filter-panel__visually-hidden">{labelFor(option.value)}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="catalog-filter-panel__section">
        <legend>{t("catalogFilters.sizes")}</legend>
        <div className="catalog-filter-panel__chips">
          {options.sizes.map((option) => (
            <button
              aria-pressed={value.sizes.includes(option.value)}
              className="catalog-filter-panel__chip"
              key={option.value}
              onClick={() => onChange({ ...value, sizes: toggleValue(value.sizes, option.value) })}
              type="button"
            >
              {labelFor(option.value)} <span>({option.count})</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="catalog-filter-panel__section">
        <legend>{t("catalogFilters.equipmentType")}</legend>
        <div className="catalog-filter-panel__chips">
          {options.equipmentTypes.map((option) => (
            <button
              aria-pressed={value.equipmentTypes.includes(option.value)}
              className="catalog-filter-panel__chip"
              key={option.value}
              onClick={() => onChange({ ...value, equipmentTypes: toggleValue(value.equipmentTypes, option.value) })}
              type="button"
            >
              {labelFor(option.value)} <span>({option.count})</span>
            </button>
          ))}
        </div>
      </fieldset>

      <button className="catalog-filter-panel__apply" onClick={onApply} type="button">
        {t("catalogFilters.apply")}
      </button>
    </section>
  );
}
