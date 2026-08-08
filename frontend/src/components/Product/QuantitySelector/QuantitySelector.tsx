import { PiMinus, PiPlus } from "react-icons/pi";
import { useTranslation } from "react-i18next";

import "./QuantitySelector.scss";

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
};

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  className = "",
}: QuantitySelectorProps) {
  const { t } = useTranslation("common");
  const selectorClassName = `quantity-selector ${className}`.trim();

  return (
    <div aria-label={t("quantity.region")} className={selectorClassName} role="group">
      <button
        aria-label={t("quantity.decrease")}
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        type="button"
      >
        <PiMinus aria-hidden="true" />
      </button>
      <output aria-live="polite" aria-label={t("quantity.value")}>
        {value}
      </output>
      <button
        aria-label={t("quantity.increase")}
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        type="button"
      >
        <PiPlus aria-hidden="true" />
      </button>
    </div>
  );
}
