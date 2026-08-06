import type { ComponentPropsWithoutRef } from "react";

import "./headings.scss";

type H1Props = Omit<ComponentPropsWithoutRef<"h1">, "children"> & {
  text: string;
};

export const H1 = ({ text, className = "", ...props }: H1Props) => {
  const classes = `heading h1 ${className}`.trim();

  return (
    <h1 {...props} className={classes}>
      {text}
    </h1>
  );
};
