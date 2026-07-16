import React from "react";
import "./paragraph.scss";

type ParagraphProps = {
  text: string; // text content
  isError?: boolean; // Turns text red when true
  className?: string; // Optional classes for customization
};

const Paragraph: React.FC<ParagraphProps> = ({ text, isError = false, className = "" }) => {
  const errorClass = isError ? "paragraph--error" : "";
  const paragraphClass = `paragraph ${errorClass} ${className}`.trim();

  return <p className={paragraphClass}>{text}</p>;
};

export default Paragraph;
