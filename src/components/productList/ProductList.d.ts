import React from "react";
import type { Product } from "../../services/productService/types";
import "./ProductList.scss";
type ProductListProps = {
    products: Product[];
    className?: string;
};
declare const ProductList: React.FC<ProductListProps>;
export default ProductList;
