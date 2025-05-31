import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import type { Crumb } from "../../components/Breadcrumbs/Breadcrumbs";

// import ProductCard from "../../components/productCard/productCard";
import { H3 } from "../../components/common/headings/H3";
import type { Product } from "../../services/productService/types";
import type { Category } from "../../services/categoryService/types";
import { fetchProductsByCategory } from "../../services/productService/productService";
import { fetchTopLevelCategories, fetchCategoryBySlug } from "../../services/categoryService/categoryService";
import ProductList from "../../components/productList/ProductList";
import "./Category.scss";
import NotFoundPage from "../NotFound/NotFound";

export default function CategoryPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [topCategories, setTopCategories] = useState<Category[]>([]); //tbc maybe i don't need

  const [products, setProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const rawPath = location.pathname.replace(/^\/catalog\/?/, "");

  const segments = rawPath === "" ? [] : rawPath.split("/");

  //old get all products

  //   useEffect(() => {
  //     async function load() {
  //       try {
  //         const data = await fetchProducts();
  //         setProducts(data);
  //         //   } catch (err: any) {
  //         //     setError(err.message || "Failed to load products");
  //       } catch (err: unknown) {
  //         if (err instanceof Error) {
  //           setError(err.message);
  //         } else setError(String(err));
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //     load();
  //   }, []);

  //   if (loading) return <div>Loading list of products…</div>; //later: consider scenario with a lot of products and slow loading
  //   if (error) return <div>Error: {error}</div>; //later: style error scenario

  //end old
  useEffect(() => {
    setLoading(true);
    setError(null);

    (async () => {
      try {
        // No segments so just /catalog
        if (segments.length === 0) {
          const cats = await fetchTopLevelCategories();
          setTopCategories(cats);

          setBreadcrumbs([]);
          setCurrentCategory(null);
          setProducts([]);
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
          const prods = await fetchProductsByCategory(lastCat.id);
          setProducts(prods);
          setCurrentCategory(lastCat);
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
    return (
      //   <div className="catalog-page">
      //     <Breadcrumbs crumbs={breadcrumbs} />
      //     <div className="error">Error: {error}</div>
      //     <button className="back-button" onClick={() => navigate(-1)}>
      //       ← Back
      //     </button>
      //   </div>
      <NotFoundPage></NotFoundPage>
    );
  }

  if (loading) {
    return <div className="catalog-page">Loading…</div>; //to do: add spinner or nice gif
  }

  return (
    <div className="category-page">
      <Breadcrumbs crumbs={breadcrumbs} />

      {/* top level - show all cats */}
      {segments.length === 0 && (
        <div className="catalog-root">
          <H3 text="All Categories" />
          <div className="category-list">
            {topCategories.map((cat) => (
              <button key={cat.id} className="category-button" onClick={() => navigate(`/catalog/${cat.slug}`)}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {segments.length > 0 && currentCategory && (
        <div className="category-content">
          <H3 text={currentCategory.name} />
          {products.length === 0 ? (
            <div className="no-products">No products found in this category.</div>
          ) : (
            <ProductList products={products} className="category-products" />
          )}
        </div>
      )}
    </div>
  );
}
