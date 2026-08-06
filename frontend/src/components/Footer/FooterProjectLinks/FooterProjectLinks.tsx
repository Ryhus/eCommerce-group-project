import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { FaFigma, FaGithub } from "react-icons/fa";
import { IoSchoolOutline } from "react-icons/io5";

import "./FooterProjectLinks.scss";

type ProjectLink = {
  href: string;
  icon: ReactNode;
  label: string;
};

const projectLinks: ProjectLink[] = [
  {
    href: "https://github.com/Ryhus/eCommerce-group-project",
    icon: <FaGithub />,
    label: "Sport Gear source code on GitHub",
  },
  {
    href: "https://www.figma.com/design/5YOFNziZ7GHoRl7tgAo3ii/E-commerce-Website-Template--Freebie---Community-",
    icon: <FaFigma />,
    label: "Original storefront design in Figma",
  },
  {
    href: "https://rs.school/",
    icon: <IoSchoolOutline />,
    label: "RS School website",
  },
];

type FooterProjectLinksProps = Omit<ComponentPropsWithoutRef<"ul">, "children">;

const FooterProjectLinks = ({ className = "", ...props }: FooterProjectLinksProps) => {
  const listClassName = `footer-project-links ${className}`.trim();

  return (
    <ul {...props} aria-label="Project links" className={listClassName}>
      {projectLinks.map(({ href, icon, label }) => (
        <li key={href}>
          <a
            aria-label={label}
            className="footer-project-links__link"
            href={href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {icon}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default FooterProjectLinks;
