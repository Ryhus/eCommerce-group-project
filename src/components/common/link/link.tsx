import React from "react";
import "./link.scss";

type LinkProps = {
  text: string; // text label
  href: string; // URL or path to go to
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void; // Optional click handler
  className?: string; // Optional CSS classes
  icon?: React.ReactNode;
};

const Link: React.FC<LinkProps> = ({ text, href, onClick, className = "", icon }) => {
  const linkClass = `link ${className}`.trim();

  return (
    <a className={linkClass} href={href} onClick={onClick}>
      {icon && <span className="link-icon">{icon}</span>}
      {text}
    </a>
  );
};

export default Link;
