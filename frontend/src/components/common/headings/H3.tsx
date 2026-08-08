import type { ComponentPropsWithoutRef } from "react";

import "./headings.scss";

type H3Props = Omit<ComponentPropsWithoutRef<"h3">, "children"> & {
  text: string;
};

export const H3 = ({ text, className = "", ...props }: H3Props) => {
  const classes = `heading h3 ${className}`.trim();

  return (
    <h3 {...props} className={classes}>
      {text}
    </h3>
  );
};
