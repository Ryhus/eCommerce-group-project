import React from "react";
import { Link } from "react-router-dom";
import "./Breadcrumbs.scss";

export interface Crumb {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbs }) => {
  return (
    <div className="breadcrumbs">
      <Link to="/">Home</Link>
      {/* use '>' as a divider */}
      <span className="breadcrumb-separatour">&gt;</span>
      <Link to="/catalog">Catalog</Link>

      {crumbs.map((crumb, idx) => (
        <React.Fragment key={idx}>
          <span className="breadcrumb-separatour">&gt;</span>
          <Link to={crumb.path}>{crumb.name}</Link>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
