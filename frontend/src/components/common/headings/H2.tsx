import React from "react";
import "./headings.scss";

//h1 - main page banner title
//h2 - page titles, section titles
//h3 - product title

type H2Props = {
  text: string;
  className?: string;
};

export const H2: React.FC<H2Props> = ({ text, className = "" }) => {
  const classes = `heading h2 ${className}`.trim();
  return <h2 className={classes}>{text}</h2>;
};
