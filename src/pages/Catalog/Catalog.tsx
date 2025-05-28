import ProductCard from "../../components/productCard/productCard";
import "./Catalog.scss";
import { H3 } from "../../components/common/headings/H3";
import { useNavigate } from "react-router-dom";

/*--- Mock products to be deleted after connecting to api---*/

type Product = {
  id: string;
  name: string;
  //onClick: () => void;
  imgUrl: string;
  currentPrice: string; // tbc if number or string
  oldPrice: string;
  altText?: string;
  className?: string;
};

const MOCK_PRODUCTS: Product[] = [
  {
    id: "shirt-001",
    name: "T-shirt with Tape Details",
    currentPrice: "120",
    oldPrice: "120",
    imgUrl:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=2112&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "shirt-002",
    name: "Graphic Tee",
    currentPrice: "85",
    oldPrice: "120",
    imgUrl:
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=2367&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

/*--- end mock products ---*/

export default function CatalogPage() {
  const navigate = useNavigate();
  return (
    <div>
      <H3 text="Catalog" />
      <div className="product-list">
        {MOCK_PRODUCTS.map((item) => (
          <ProductCard
            name={item.name}
            currentPrice={item.currentPrice}
            oldPrice={item.oldPrice}
            imgUrl={item.imgUrl}
            onClick={() => navigate(`products/${item.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
