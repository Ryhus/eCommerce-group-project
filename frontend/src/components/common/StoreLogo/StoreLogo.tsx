import { useTranslation } from "react-i18next";
import { Link, type LinkProps } from "react-router-dom";

import "./StoreLogo.scss";

type StoreLogoProps = Omit<LinkProps, "aria-label" | "children" | "to"> & {
  to?: LinkProps["to"];
};

export function StoreLogo({ className = "", to = "/", ...props }: StoreLogoProps) {
  const { t } = useTranslation("common");
  const classes = `store-logo ${className}`.trim();

  return (
    <Link {...props} aria-label={t("brand.home")} className={classes} to={to}>
      SPORT GEAR
    </Link>
  );
}
