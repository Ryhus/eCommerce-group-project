import ProductCard from "../../components/productCard/productCard";
import "./Catalog.scss";
import { H3 } from "../../components/common/headings/H3";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Product } from "../../services/productService/types.js";
import { fetchProducts } from "../../services/productService/productService.js";

/*--- Mock products to be deleted after connecting to api---*/

// type Product = {
//   id: string;
//   name: string;
//   imgUrls: string[];
//   currentPrice: string;
//   oldPrice: string;
// };

// const MOCK_PRODUCTS: Product[] = [
//   {
//     id: "shirt-001",
//     name: "T-shirt with Tape Details",
//     currentPrice: "120",
//     oldPrice: "120",
//     imgUrls: [
//       "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=2112&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     ],
//   },
//   {
//     id: "shirt-002",
//     name: "Graphic Tee",
//     currentPrice: "85",
//     oldPrice: "120",
//     imgUrls: [
//       "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=2367&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     ],
//   },
// ];

/*--- end mock products ---*/

export default function CatalogPage() {
  const navigate = useNavigate();
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
      {
        <div className="product-list">
          {products.map((item) => (
            <ProductCard
              key={item.id}
              id={item.id}
              name={item.name}
              currentPrice={item.currentPrice}
              oldPrice={item.oldPrice}
              imgUrl={item.imgUrls[0]}
              onClick={() => navigate(`products/${item.id}`)}
            />
          ))}
        </div>
      }
    </div>
  );
}
