import { PiMinus, PiPlus } from "react-icons/pi";

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
  const selectorClassName = `quantity-selector ${className}`.trim();

  return (
    <div aria-label="Product quantity" className={selectorClassName} role="group">
      <button
        aria-label="Decrease quantity"
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        type="button"
      >
        <PiMinus aria-hidden="true" />
      </button>
      <output aria-live="polite" aria-label="Quantity">
        {value}
      </output>
      <button
        aria-label="Increase quantity"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        type="button"
      >
        <PiPlus aria-hidden="true" />
      </button>
    </div>
  );
}
