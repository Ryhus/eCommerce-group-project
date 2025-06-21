import React from "react";
import "./Sorting.scss";
export type SortOption = "default" | "price asc" | "price desc" | "name asc" | "name desc";
export interface SortingProps {
  currentSort: SortOption;
  onSortChange: (newSort: SortOption) => void;
}
export declare const Sorting: React.FC<SortingProps>;
export default Sorting;
