import { PiCaretRight } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import "./Breadcrumbs.scss";

export interface Crumb {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
  includeCatalog?: boolean;
}

const BreadcrumbSeparator = () => <PiCaretRight aria-hidden="true" className="breadcrumbs__separator" />;

const Breadcrumbs = ({ crumbs, includeCatalog = true }: BreadcrumbsProps) => {
  const { t } = useTranslation("common");

  return (
    <nav aria-label={t("breadcrumbs.navigation")} className="breadcrumbs">
      <ol>
        <li>
          <Link to="/">{t("breadcrumbs.home")}</Link>
          {(includeCatalog || crumbs.length > 0) && <BreadcrumbSeparator />}
        </li>
        {includeCatalog && (
          <li>
            {crumbs.length ? (
              <Link to="/catalog">{t("breadcrumbs.catalog")}</Link>
            ) : (
              <span aria-current="page">{t("breadcrumbs.catalog")}</span>
            )}
            {crumbs.length > 0 && <BreadcrumbSeparator />}
          </li>
        )}
        {crumbs.map((crumb, index) => {
          const isCurrentPage = index === crumbs.length - 1;
          return (
            <li key={crumb.path}>
              {isCurrentPage ? (
                <span aria-current="page">{crumb.name}</span>
              ) : (
                <>
                  <Link to={crumb.path}>{crumb.name}</Link>
                  <BreadcrumbSeparator />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
