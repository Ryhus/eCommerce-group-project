import type { ComponentPropsWithoutRef } from "react";

import "./headings.scss";

type H2Props = Omit<ComponentPropsWithoutRef<"h2">, "children"> & {
  text: string;
};

export const H2 = ({ text, className = "", ...props }: H2Props) => {
  const classes = `heading h2 ${className}`.trim();

  return (
    <h2 {...props} className={classes}>
      {text}
    </h2>
  );
};
