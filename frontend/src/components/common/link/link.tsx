import type { ComponentPropsWithoutRef, ReactNode } from "react";

import "./link.scss";

type LinkProps = Omit<ComponentPropsWithoutRef<"a">, "children" | "href"> & {
  text: string;
  href: string;
  icon?: ReactNode;
};

const Link = ({ text, href, className = "", icon, ...props }: LinkProps) => {
  const linkClass = `link ${className}`.trim();

  return (
    <a {...props} className={linkClass} href={href}>
      {icon && <span className="link-icon">{icon}</span>}
      {text}
    </a>
  );
};

export default Link;
