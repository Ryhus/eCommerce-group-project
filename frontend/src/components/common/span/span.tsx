import type { ComponentPropsWithoutRef } from "react";

import "./span.scss";

type SpanProps = Omit<ComponentPropsWithoutRef<"span">, "children"> & {
  text: string;
  isError?: boolean;
};

const Span = ({ text, isError = false, className = "", ...props }: SpanProps) => {
  const errorClass = isError ? "span--error" : "";
  const spanClass = `span ${errorClass} ${className}`.trim();

  return (
    <span {...props} className={spanClass}>
      {text}
    </span>
  );
};

export default Span;
