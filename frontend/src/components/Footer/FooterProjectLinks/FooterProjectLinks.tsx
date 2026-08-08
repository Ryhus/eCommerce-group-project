import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { FaFigma, FaGithub } from "react-icons/fa";
import { IoSchoolOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

import "./FooterProjectLinks.scss";

type ProjectLink = {
  href: string;
  icon: ReactNode;
  labelKey: "projectLinks.sourceCode" | "projectLinks.design" | "projectLinks.school";
};

const projectLinks: ProjectLink[] = [
  {
    href: "https://github.com/Ryhus/eCommerce-group-project",
    icon: <FaGithub />,
    labelKey: "projectLinks.sourceCode",
  },
  {
    href: "https://www.figma.com/design/5YOFNziZ7GHoRl7tgAo3ii/E-commerce-Website-Template--Freebie---Community-",
    icon: <FaFigma />,
    labelKey: "projectLinks.design",
  },
  {
    href: "https://rs.school/",
    icon: <IoSchoolOutline />,
    labelKey: "projectLinks.school",
  },
];

type FooterProjectLinksProps = Omit<ComponentPropsWithoutRef<"ul">, "children">;

const FooterProjectLinks = ({ className = "", ...props }: FooterProjectLinksProps) => {
  const { t } = useTranslation("common");
  const listClassName = `footer-project-links ${className}`.trim();

  return (
    <ul {...props} aria-label={t("projectLinks.list")} className={listClassName}>
      {projectLinks.map(({ href, icon, labelKey }) => (
        <li key={href}>
          <a
            aria-label={t(labelKey)}
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
