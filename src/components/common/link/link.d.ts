import React from "react";
import "./link.scss";
type LinkProps = {
  text: string;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
};
declare const Link: React.FC<LinkProps>;
export default Link;
