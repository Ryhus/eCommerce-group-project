import React from "react";
import "./headings.scss";

//h1 - main page banner title
//h2 - page titles, section titles
//h3 - product title

type H1Props = {
  text: string;
  className?: string;
};

export const H1: React.FC<H1Props> = ({ text, className = "" }) => {
  const classes = `heading h1 ${className}`.trim();
  return <h1 className={classes}>{text}</h1>;
};
