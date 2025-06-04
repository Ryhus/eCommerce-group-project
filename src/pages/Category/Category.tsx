import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { H3 } from "../../components/common/headings/H3";
import Paragraph from "../../components/common/paragraph/paragraph";
import Link from "../../components/common/link/link";
import NotFoundPage from "../NotFound/NotFound";
import ProductList from "../../components/productList/ProductList";
import Sorting from "../../components/Sorting/Sorting";

import type { Product } from "../../services/productService/types";
import type { Category } from "../../services/categoryService/types";
import type { Crumb } from "../../components/Breadcrumbs/Breadcrumbs";
import type { SortOption } from "../../components/Sorting/Sorting";

import { fetchProductsByCategory, fetchProducts } from "../../services/productService/productService";
import { fetchCategoryBySlug, fetchChildCategories } from "../../services/categoryService/categoryService";
import "./Category.scss";
import { IoMdOptions, IoMdClose } from "react-icons/io";

export default function CategoryPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categoriesToShow, setCategoriesToShow] = useState<Category[]>([]);

  const [products, setProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentSort, setCurrentSort] = useState<SortOption>("default");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const rawPath = location.pathname.replace(/^\/catalog\/?/, "");
  const segments = rawPath === "" ? [] : rawPath.split("/");

  useEffect(() => {
    setLoading(true);
    setError(null);

    (async () => {
      try {
        let parentId: string | null = null;
        let lastCat: Category | null = null;
        const crumbsTemp: Crumb[] = [];

        if (segments.length > 0) {
          for (let i = 0; i < segments.length; i++) {
            const slug = segments[i];
            const cat = await fetchCategoryBySlug(slug, parentId);
            if (!cat) {
              setError(`Category not found: "${slug}"`);
              setLoading(false);
              return;
            }

            const pathSoFar = "/catalog/" + segments.slice(0, i + 1).join("/");
            crumbsTemp.push({ name: cat.name, path: pathSoFar });

            parentId = cat.id;
            lastCat = cat;
          }
          setCurrentCategory(lastCat);
        } else {
          setCurrentCategory(null);
        }

        setBreadcrumbs(crumbsTemp);
        const cats = await fetchChildCategories(parentId);
        setCategoriesToShow(cats);

        let sortParam: string | undefined = undefined;
        switch (currentSort) {
          case "price asc":
            sortParam = "price asc";
            break;
          case "price desc":
            sortParam = "price desc";
            break;
          case "name asc":
            sortParam = "name.en asc";
            break;
          case "name desc":
            sortParam = "name.en desc";
            break;
          default:
            sortParam = undefined;
        }

        if (parentId === null) {
          const allProds = await fetchProducts(sortParam);
          setProducts(allProds);
        } else {
          const prods = await fetchProductsByCategory(parentId, sortParam);
          setProducts(prods);
        }
        setLoading(false);
      } catch (err: unknown) {
        console.error(err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message ?? err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, currentSort]);

  if (error) {
    return <NotFoundPage />;
  }

  if (loading) {
    return <div className="catalog-page">Loading…</div>; //placeholder: add styles, spinner or something
  }

  const isRoot = segments.length === 0;
  const title = isRoot ? "All products" : (currentCategory?.name ?? "Loading Category…");
  const baseCatalogPath = segments.length > 0 ? "/catalog/" + segments.join("/") : "/catalog/";

  const sidebarContent = (
    <>
      {categoriesToShow.length > 0 && (
        <div className="category-list">
          {categoriesToShow.map((cat) => {
            const nextURL = isRoot ? `/catalog/${cat.slug}` : `${baseCatalogPath}/${cat.slug}`;
            return (
              <Link
                key={cat.id}
                text={cat.name}
                className="category-link"
                href=""
                onClick={() => {
                  setIsMobileFilterOpen(false);
                  navigate(nextURL);
                }}
              />
            );
          })}
        </div>
      )}
      <div className="filters">
        {/* Replace with your real Filters component */}
        <strong>Filters (placeholder)</strong>
      </div>
    </>
  );
  return (
    <div className="category-page">
      <Breadcrumbs crumbs={breadcrumbs} />
      <div className="category-content">
        <div className="category-subcats-filter">{sidebarContent}</div>
        <div className="category-content-colomn">
          <div className="category-title-sort">
            <H3 text={title} />
            <Sorting
              currentSort={currentSort}
              onSortChange={(newSort) => {
                setCurrentSort(newSort);
              }}
            />
            <button
              className="mobile-filter-toggle"
              onClick={() => setIsMobileFilterOpen(true)}
              aria-label="Open Filters"
            >
              <IoMdOptions size={24} />
            </button>
          </div>
          {products.length === 0 ? (
            <Paragraph
              className="no-products"
              text={isRoot ? "No products available." : "No products in this category yet."}
            />
          ) : (
            <ProductList products={products} className="category-products" />
          )}
        </div>
      </div>
      {isMobileFilterOpen && (
        <div className="mobile-filter-overlay">
          <button className="close-overlay" onClick={() => setIsMobileFilterOpen(false)} aria-label="Close Filters">
            <IoMdClose size={28} />
          </button>
          <div className="category-subcats-filter-inner">{sidebarContent}</div>
        </div>
      )}
    </div>
  );
}
