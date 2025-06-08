import React from "react";
import "./Breadcrumbs.scss";
export interface Crumb {
    name: string;
    path: string;
}
interface BreadcrumbsProps {
    crumbs: Crumb[];
}
declare const Breadcrumbs: React.FC<BreadcrumbsProps>;
export default Breadcrumbs;
