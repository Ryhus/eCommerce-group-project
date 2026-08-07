import { useEffect, useMemo, useState } from "react";
import { PiSlidersHorizontal } from "react-icons/pi";
import { useLocation, useSearchParams } from "react-router-dom";

import Breadcrumbs, { type Crumb } from "../../components/Breadcrumbs/Breadcrumbs";
import { CategoryFilter, type CategoryFilterItem } from "../../components/Catalog/CategoryFilter/CategoryFilter";
import { FilterDrawer } from "../../components/Catalog/FilterDrawer/FilterDrawer";
import { PageContainer } from "../../components/common/PageContainer/PageContainer";
import { Pagination } from "../../components/common/Pagination/Pagination";
import ProductList from "../../components/productList/ProductList";
import Sorting, { type SortOption } from "../../components/Sorting/Sorting";
import { fetchCategoryBySlug, fetchChildCategories } from "../../services/categoryService/categoryService";
import type { Category } from "../../services/categoryService/types";
import { fetchProductPage } from "../../services/productService/productService";
import type { ProductPage } from "../../services/productService/types";
import NotFoundPage from "../NotFound/NotFound";

import "./Category.scss";

const PAGE_SIZE = 6;
const EMPTY_PAGE: ProductPage = { items: [], offset: 0, limit: PAGE_SIZE, total: 0 };
const SORT_OPTIONS: SortOption[] = ["default", "price asc", "price desc", "name asc", "name desc"];

class CategoryNotFoundError extends Error {}

function readPage(value: string | null): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function readSort(value: string | null): SortOption {
  return SORT_OPTIONS.includes(value as SortOption) ? (value as SortOption) : "default";
}

function apiSort(sort: SortOption): string | undefined {
  switch (sort) {
    case "price asc":
    case "price desc":
      return sort;
    case "name asc":
      return "name.en asc";
    case "name desc":
      return "name.en desc";
    default:
      return undefined;
  }
}

function categoryPath(parentSegments: string[], slug: string): string {
  return ["", "catalog", ...parentSegments, slug].join("/");
}

function pageSummary(page: ProductPage): string {
  if (!page.total) return "0 products";
  const firstItem = page.offset + 1;
  const lastItem = Math.min(page.offset + page.items.length, page.total);
  return `Showing ${firstItem}-${lastItem} of ${page.total} products`;
}

export default function CategoryPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>([]);
  const [categoryItems, setCategoryItems] = useState<CategoryFilterItem[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [productPage, setProductPage] = useState<ProductPage>(EMPTY_PAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryNotFound, setCategoryNotFound] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const rawPath = location.pathname.replace(/^\/catalog\/?/, "");
  const segments = useMemo(() => (rawPath ? rawPath.split("/").filter(Boolean) : []), [rawPath]);
  const currentPage = readPage(searchParams.get("page"));
  const currentSort = readSort(searchParams.get("sort"));
  const searchTerm = searchParams.get("search")?.trim() ?? "";

  useEffect(() => {
    let cancelled = false;

    const loadCatalog = async () => {
      setIsLoading(true);
      setError(null);
      setCategoryNotFound(false);

      try {
        let parentId: string | null = null;
        let selectedCategory: Category | null = null;
        const nextBreadcrumbs: Crumb[] = [];

        for (let index = 0; index < segments.length; index += 1) {
          const slug = segments[index];
          const category = await fetchCategoryBySlug(slug, parentId);
          if (!category) throw new CategoryNotFoundError();

          parentId = category.id;
          selectedCategory = category;
          nextBreadcrumbs.push({
            name: category.name,
            path: categoryPath(segments.slice(0, index), category.slug),
          });
        }

        const [children, nextProductPage] = await Promise.all([
          fetchChildCategories(parentId),
          fetchProductPage({
            categoryId: parentId ?? undefined,
            limit: PAGE_SIZE,
            offset: (currentPage - 1) * PAGE_SIZE,
            search: searchTerm,
            sort: apiSort(currentSort),
          }),
        ]);

        let navigationCategories = children;
        let navigationSegments = segments;
        if (!children.length && selectedCategory?.parentId) {
          navigationCategories = await fetchChildCategories(selectedCategory.parentId);
          navigationSegments = segments.slice(0, -1);
        }

        if (cancelled) return;

        setBreadcrumbs(nextBreadcrumbs);
        setCurrentCategory(selectedCategory);
        setCategoryItems(
          navigationCategories.map((category) => ({
            id: category.id,
            isActive: category.id === selectedCategory?.id,
            name: category.name,
            to: categoryPath(navigationSegments, category.slug),
          }))
        );
        setProductPage(nextProductPage);
      } catch (loadError) {
        if (cancelled) return;
        if (loadError instanceof CategoryNotFoundError) setCategoryNotFound(true);
        else setError(loadError instanceof Error ? loadError.message : "Unable to load the catalog.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadCatalog();

    return () => {
      cancelled = true;
    };
  }, [currentPage, currentSort, reloadKey, searchTerm, segments]);

  const updatePage = (page: number) => {
    const nextParams = new URLSearchParams(searchParams);
    if (page === 1) nextParams.delete("page");
    else nextParams.set("page", String(page));
    setSearchParams(nextParams);
  };

  const updateSort = (sort: SortOption) => {
    const nextParams = new URLSearchParams(searchParams);
    if (sort === "default") nextParams.delete("sort");
    else nextParams.set("sort", sort);
    nextParams.delete("page");
    setSearchParams(nextParams);
  };

  if (categoryNotFound) return <NotFoundPage />;

  const title = searchTerm ? `Search results for “${searchTerm}”` : (currentCategory?.name ?? "All products");

  return (
    <PageContainer className="category-page">
      <Breadcrumbs crumbs={breadcrumbs} />

      <div className="category-page__layout">
        <aside className="category-page__sidebar">
          <CategoryFilter items={categoryItems} />
        </aside>

        <main aria-labelledby="catalog-title" className="category-page__main">
          <header className="category-page__toolbar">
            <div className="category-page__heading">
              <h1 id="catalog-title">{title}</h1>
              <p>{isLoading ? "Loading products…" : pageSummary(productPage)}</p>
            </div>

            <Sorting className="category-page__desktop-sort" currentSort={currentSort} onSortChange={updateSort} />
            <button
              aria-controls="catalog-options"
              aria-expanded={isDrawerOpen}
              aria-label="Open catalog options"
              className="category-page__filter-toggle"
              onClick={() => setIsDrawerOpen(true)}
              type="button"
            >
              <PiSlidersHorizontal aria-hidden="true" />
            </button>
          </header>

          {isLoading ? (
            <div aria-live="polite" className="category-page__status" role="status">
              <span className="category-page__spinner" />
              Loading products…
            </div>
          ) : error ? (
            <div className="category-page__status" role="alert">
              <p>{error}</p>
              <button className="category-page__retry" onClick={() => setReloadKey((key) => key + 1)} type="button">
                Try again
              </button>
            </div>
          ) : productPage.items.length ? (
            <>
              <ProductList className="category-products" products={productPage.items} />
              <Pagination
                className="category-page__pagination"
                currentPage={currentPage}
                onPageChange={updatePage}
                pageSize={PAGE_SIZE}
                totalItems={productPage.total}
              />
            </>
          ) : (
            <div className="category-page__status">
              <p>{searchTerm ? `No products found for “${searchTerm}”.` : "No products found in this category."}</p>
            </div>
          )}
        </main>
      </div>

      <div id="catalog-options">
        <FilterDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <Sorting currentSort={currentSort} onSortChange={updateSort} />
          <CategoryFilter items={categoryItems} onNavigate={() => setIsDrawerOpen(false)} />
        </FilterDrawer>
      </div>
    </PageContainer>
  );
}
