import { useEffect, useMemo, useState } from "react";
import { PiSlidersHorizontal } from "react-icons/pi";
import { useTranslation } from "react-i18next";
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

function pageRange(page: ProductPage): { first: number; last: number; total: number } | null {
  if (!page.total) return null;
  const firstItem = page.offset + 1;
  const lastItem = Math.min(page.offset + page.items.length, page.total);
  return { first: firstItem, last: lastItem, total: page.total };
}

export default function CategoryPage() {
  const { t } = useTranslation("common");
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>([]);
  const [categoryItems, setCategoryItems] = useState<CategoryFilterItem[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [productPage, setProductPage] = useState<ProductPage>(EMPTY_PAGE);
  const [resolvedRequestKey, setResolvedRequestKey] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [categoryNotFound, setCategoryNotFound] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const rawPath = location.pathname.replace(/^\/catalog\/?/, "");
  const segments = useMemo(() => (rawPath ? rawPath.split("/").filter(Boolean) : []), [rawPath]);
  const currentPage = readPage(searchParams.get("page"));
  const currentSort = readSort(searchParams.get("sort"));
  const searchTerm = searchParams.get("search")?.trim() ?? "";
  const requestKey = `${location.pathname}?${searchParams.toString()}#${reloadKey}`;
  const isLoading = resolvedRequestKey !== requestKey;

  useEffect(() => {
    let cancelled = false;

    const loadCatalog = async () => {
      setHasError(false);
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
        else setHasError(true);
      } finally {
        if (!cancelled) setResolvedRequestKey(requestKey);
      }
    };

    void loadCatalog();

    return () => {
      cancelled = true;
    };
  }, [currentPage, currentSort, requestKey, searchTerm, segments]);

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

  if (!isLoading && categoryNotFound) {
    throw new Response(null, { status: 404, statusText: "Category not found" });
  }

  const title = searchTerm
    ? t("catalog.searchResults", { term: searchTerm })
    : isLoading
      ? t("catalog.title")
      : (currentCategory?.name ?? t("catalog.allProducts"));
  const visibleBreadcrumbs = isLoading ? [] : breadcrumbs;
  const visibleCategoryItems = isLoading ? [] : categoryItems;
  const visibleRange = pageRange(productPage);

  return (
    <PageContainer className="category-page">
      <Breadcrumbs crumbs={visibleBreadcrumbs} />

      <div className="category-page__layout">
        <aside className="category-page__sidebar">
          <CategoryFilter items={visibleCategoryItems} />
        </aside>

        <main aria-labelledby="catalog-title" className="category-page__main">
          <header className="category-page__toolbar">
            <div className="category-page__heading">
              <h1 id="catalog-title">{title}</h1>
              <p>
                {isLoading
                  ? t("catalog.loadingProducts")
                  : visibleRange
                    ? t("catalog.pageSummary", visibleRange)
                    : t("catalog.zeroProducts")}
              </p>
            </div>

            <Sorting className="category-page__desktop-sort" currentSort={currentSort} onSortChange={updateSort} />
            <button
              aria-controls="catalog-options"
              aria-expanded={isDrawerOpen}
              aria-label={t("catalog.openOptions")}
              className="category-page__filter-toggle"
              onClick={() => setIsDrawerOpen(true)}
              type="button"
            >
              <PiSlidersHorizontal aria-hidden="true" />
            </button>
          </header>

          {isLoading ? (
            <div aria-label={t("catalog.loading")} aria-live="polite" className="category-page__status" role="status">
              <span className="category-page__spinner" />
              {t("catalog.loadingProducts")}
            </div>
          ) : hasError ? (
            <div className="category-page__status" role="alert">
              <p>{t("catalog.loadError")}</p>
              <button className="category-page__retry" onClick={() => setReloadKey((key) => key + 1)} type="button">
                {t("catalog.retry")}
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
              <p>{searchTerm ? t("catalog.noSearchResults", { term: searchTerm }) : t("catalog.noCategoryProducts")}</p>
            </div>
          )}
        </main>
      </div>

      <div id="catalog-options">
        <FilterDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <Sorting currentSort={currentSort} onSortChange={updateSort} />
          <CategoryFilter items={visibleCategoryItems} onNavigate={() => setIsDrawerOpen(false)} />
        </FilterDrawer>
      </div>
    </PageContainer>
  );
}
