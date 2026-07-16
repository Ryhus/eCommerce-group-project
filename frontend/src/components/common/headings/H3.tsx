import React from "react";
import "./headings.scss";

//h1 - main page banner title
//h2 - page titles, section titles
//h3 - product title

type H3Props = {
  text: string;
  className?: string;
};

export const H3: React.FC<H3Props> = ({ text, className = "" }) => {
  const classes = `heading h3 ${className}`.trim();
  return <h3 className={classes}>{text}</h3>;
};
