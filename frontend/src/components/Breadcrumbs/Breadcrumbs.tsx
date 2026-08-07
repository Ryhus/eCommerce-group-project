import { PiCaretRight } from "react-icons/pi";
import { Link } from "react-router-dom";

import "./Breadcrumbs.scss";

export interface Crumb {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

const BreadcrumbSeparator = () => <PiCaretRight aria-hidden="true" className="breadcrumbs__separator" />;

const Breadcrumbs = ({ crumbs }: BreadcrumbsProps) => {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        <li>
          <Link to="/">Home</Link>
          <BreadcrumbSeparator />
        </li>
        <li>
          {crumbs.length ? <Link to="/catalog">Catalog</Link> : <span aria-current="page">Catalog</span>}
          {crumbs.length > 0 && <BreadcrumbSeparator />}
        </li>
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
