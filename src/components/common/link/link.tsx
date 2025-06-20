import React from "react";
import "./link.scss";

type LinkProps = {
  text: string; // text label
  href: string; // URL or path to go to
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void; // Optional click handler
  className?: string; // Optional CSS classes
};

const Link: React.FC<LinkProps> = ({ text, href, onClick, className = "" }) => {
  const linkClass = `link ${className}`.trim();

  return (
    <a className={linkClass} href={href} onClick={onClick}>
      {text}
    </a>
  );
};

export default Link;
