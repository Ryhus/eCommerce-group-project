import type { ComponentPropsWithoutRef } from "react";

import "./paragraph.scss";

type ParagraphProps = Omit<ComponentPropsWithoutRef<"p">, "children"> & {
  text: string;
  isError?: boolean;
};

const Paragraph = ({ text, isError = false, className = "", ...props }: ParagraphProps) => {
  const errorClass = isError ? "paragraph--error" : "";
  const paragraphClass = `paragraph ${errorClass} ${className}`.trim();

  return (
    <p {...props} className={paragraphClass}>
      {text}
    </p>
  );
};

export default Paragraph;
