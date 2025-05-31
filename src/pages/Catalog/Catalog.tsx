// import ProductCard from "../../components/productCard/productCard";
import "./Catalog.scss";
import { H3 } from "../../components/common/headings/H3";
// import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Product } from "../../services/productService/types";
import { fetchProducts } from "../../services/productService/productService";
import ProductList from "../../components/productList/ProductList";

export default function CatalogPage() {
  //   const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  //   const [error] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProducts();
        setProducts(data);
        //   } catch (err: any) {
        //     setError(err.message || "Failed to load products");
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else setError(String(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div>Loading list of products…</div>; //later: consider scenario with a lot of products and slow loading
  if (error) return <div>Error: {error}</div>; //later: style error scenario

  return (
    <div>
      <H3 text="Catalog" />
      <ProductList products={products} />
    </div>
  );
}
