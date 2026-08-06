import { useId, type ComponentPropsWithoutRef } from "react";
import { Link } from "react-router-dom";

import "./FooterLinkColumn.scss";

export type FooterLinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterLinkColumnProps = Omit<ComponentPropsWithoutRef<"nav">, "children"> & {
  title: string;
  links: FooterLinkItem[];
};

const FooterLinkColumn = ({ title, links, className = "", ...props }: FooterLinkColumnProps) => {
  const titleId = useId();
  const navClassName = `footer-link-column ${className}`.trim();

  return (
    <nav {...props} aria-labelledby={titleId} className={navClassName}>
      <h2 className="footer-link-column__title" id={titleId}>
        {title}
      </h2>
      <ul className="footer-link-column__list">
        {links.map(({ label, href, external }) => (
          <li key={`${label}-${href}`}>
            {external ? (
              <a className="footer-link-column__link" href={href} rel="noopener noreferrer" target="_blank">
                {label}
              </a>
            ) : (
              <Link className="footer-link-column__link" to={href}>
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FooterLinkColumn;
