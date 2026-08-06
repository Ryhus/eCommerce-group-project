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

import { fetchProducts } from "../../services/productService/productService";
import { fetchCategoryBySlug, fetchChildCategories } from "../../services/categoryService/categoryService";

import "./Category.scss";
import { IoMdOptions, IoMdClose } from "react-icons/io";

const PAGE_SIZE = 20;

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

  const [offset, setOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const rawPath = location.pathname.replace(/^\/catalog\/?/, "");
  const segments = rawPath === "" ? [] : rawPath.split("/");
  const searchTerm = new URLSearchParams(location.search).get("search")?.trim() ?? "";

  const getSortParam = (sortOption: SortOption): string | undefined => {
    switch (sortOption) {
      case "price asc":
      case "price desc":
        return sortOption;
      case "name asc":
        return "name.en asc";
      case "name desc":
        return "name.en desc";
      default:
        return undefined;
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitial = async () => {
      setLoading(true);
      setError(null);

      try {
        let parentId: string | null = null;
        let lastCat: Category | null = null;
        const crumbsTemp: Crumb[] = [];

        if (segments.length > 0) {
          for (let i = 0; i < segments.length; i++) {
            const slug = segments[i];
            const cat = await fetchCategoryBySlug(slug, parentId);
            if (!cat) throw new Error(`Category not found: "${slug}"`);

            const pathSoFar = "/catalog/" + segments.slice(0, i + 1).join("/");
            crumbsTemp.push({ name: cat.name, path: pathSoFar });

            parentId = cat.id;
            lastCat = cat;
          }
          setCurrentCategory(lastCat);
        } else {
          setCurrentCategory(null);
        }

        if (cancelled) return;

        setBreadcrumbs(crumbsTemp);
        setCategoriesToShow(await fetchChildCategories(parentId));

        /* Initial product batch */
        const sortParam = getSortParam(currentSort);
        const firstProducts = await fetchProducts({
          categoryId: parentId ?? undefined,
          sort: sortParam,
          search: searchTerm,
          offset: 0,
          limit: PAGE_SIZE,
        });

        if (cancelled) return;

        setProducts(firstProducts);
        setOffset(firstProducts.length); // might be < PAGE_SIZE
        setHasMore(firstProducts.length === PAGE_SIZE);
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        if (axios.isAxiosError(err)) setError(err.response?.data?.message ?? err.message);
        else if (err instanceof Error) setError(err.message);
        else setError(String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadInitial();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search, currentSort]);

  const loadMoreProducts = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    try {
      const sortParam = getSortParam(currentSort);
      const nextOffset = offset;
      const more = await fetchProducts({
        categoryId: currentCategory?.id,
        sort: sortParam,
        search: searchTerm,
        offset: nextOffset,
        limit: PAGE_SIZE,
      });

      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newUnique = more.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newUnique];
      });

      setOffset(nextOffset + more.length);
      setHasMore(more.length === PAGE_SIZE);
    } catch (err) {
      console.error("Error loading more:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (error) return <NotFoundPage />;

  if (loading)
    return (
      <div className="loading">
        <img src="/images/loading.gif" alt="Loading..." />
      </div>
    );

  const isRoot = segments.length === 0;
  const title = searchTerm
    ? `Search results for “${searchTerm}”`
    : isRoot
      ? "All products"
      : (currentCategory?.name ?? "Loading Category…");
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
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileFilterOpen(false);
                  navigate(nextURL);
                }}
              />
            );
          })}
        </div>
      )}
      <div className="filters">
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
            <Sorting currentSort={currentSort} onSortChange={(s) => setCurrentSort(s)} />
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
              text={
                searchTerm
                  ? `No products found for “${searchTerm}”.`
                  : isRoot
                    ? "No products available."
                    : "No products in this category yet."
              }
            />
          ) : (
            <>
              <ProductList products={products} className="category-products" />

              {hasMore ? (
                <div className="load-more-wrapper">
                  <button className="btn btn-medium load-more-btn" onClick={loadMoreProducts} disabled={isLoadingMore}>
                    {isLoadingMore ? "Loading..." : "See more"}
                  </button>
                </div>
              ) : (
                <p className="no-more-products">You’ve reached the end ✨</p>
              )}
            </>
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
