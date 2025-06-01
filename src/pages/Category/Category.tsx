import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import type { Crumb } from "../../components/Breadcrumbs/Breadcrumbs";

// import ProductCard from "../../components/productCard/productCard";
import { H3 } from "../../components/common/headings/H3";
import type { Product } from "../../services/productService/types";
import type { Category } from "../../services/categoryService/types";
import { fetchProductsByCategory, fetchProducts } from "../../services/productService/productService";
import {
  fetchTopLevelCategories,
  fetchCategoryBySlug,
  fetchChildCategories,
} from "../../services/categoryService/categoryService";
import ProductList from "../../components/productList/ProductList";
import "./Category.scss";
import NotFoundPage from "../NotFound/NotFound";
import Paragraph from "../../components/common/paragraph/paragraph";
import Link from "../../components/common/link/link";

export default function CategoryPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [topCategories, setTopCategories] = useState<Category[]>([]); //tbc maybe i don't need
  const [childCategories, setChildCategories] = useState<Category[]>([]);

  const [products, setProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const rawPath = location.pathname.replace(/^\/catalog\/?/, "");

  const segments = rawPath === "" ? [] : rawPath.split("/");

  useEffect(() => {
    setLoading(true);
    setError(null);

    (async () => {
      try {
        // No segments so just /catalog
        if (segments.length === 0) {
          const cats = await fetchTopLevelCategories();
          setTopCategories(cats);
          const prods = await fetchProducts();

          setBreadcrumbs([]);
          setCurrentCategory(null);
          setProducts(prods);
          setLoading(false);
          return;
        }

        // at least one slug in the URL
        let parentId: string | null = null;
        let lastCat: Category | null = null;
        const crumbsTemp: Crumb[] = [];

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

        if (lastCat) {
          const children = await fetchChildCategories(lastCat.id);
          const prods = await fetchProductsByCategory(lastCat.id);
          setProducts(prods);
          setCurrentCategory(lastCat);
          setChildCategories(children);
        }

        setBreadcrumbs(crumbsTemp);
        setLoading(false);
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
        setLoading(false);
      }
    })();
  }, [location.pathname]);

  if (error) {
    return <NotFoundPage></NotFoundPage>;
  }

  if (loading) {
    return <div className="catalog-page">Loading…</div>; //to do: add spinner or nice gif
  }

  return (
    <div className="category-page">
      <Breadcrumbs crumbs={breadcrumbs} />
      {/* top level - show all cats */}
      {segments.length === 0 && (
        <div className="category-content">
          <H3 text="All Categories" />
          <Link text="Sort: most relevant" href="#" onClick={() => navigate("#")} />
          <div className="category-list">
            {topCategories.map((cat) => (
              <Link
                text={cat.name}
                className="category-link"
                href="#"
                onClick={() => navigate(`/catalog/${cat.slug}`)}
              />
              //   <button key={cat.id} className="category-button" onClick={() => navigate(`/catalog/${cat.slug}`)}>
              //     {cat.name}
              //   </button>
            ))}
          </div>
          <ProductList products={products} className="category-products" />
        </div>
      )}

      {segments.length > 0 && currentCategory && (
        <div className="category-content">
          <H3 text={currentCategory.name} />
          <Link text="Sort: most relevant" href="#" onClick={() => navigate("#")} />
          <div className="category-list">
            {childCategories.map((cat) => (
              //   <button key={cat.id} className="category-button" onClick={() => navigate(`/catalog/${cat.slug}`)}>
              //     {cat.name}
              //   </button>
              <Link
                text={cat.name}
                className="category-link"
                href="#"
                onClick={() => navigate(`/catalog/${cat.slug}`)}
              />
            ))}
          </div>
          {products.length === 0 ? (
            <Paragraph className="no-products" text="No products in this category yet." />
          ) : (
            <ProductList products={products} className="category-products" />
          )}
        </div>
      )}
    </div>
  );
}
