import { useEffect, useState } from "react";
import { fetchProductByKey } from "../../services/productService/productService";
import type { Product } from "../../services/productService/types";
import Button from "../../components/common/button/button";
// import Paragraph from "../../components/common/paragraph/paragraph";
import "./Product.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const productKey = "yoga-mat-00";

  useEffect(() => {
    fetchProductByKey(productKey)
      .then((data) => {
        if (data) setProduct(data);
        else setError("Product not found.");
      })
      .catch((err) => setError(err.message));
  }, [productKey]);

  if (error) return <div>{error}</div>;
  if (!product) return <div>Loading product...</div>;

  return (
    <div className="product-page">
      <div className="product-container">
        {/* Left: Image Gallery */}
        <div className="product-page__slider">
          {product.imgUrls.length > 1 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={10}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              loop={product.imgUrls.length > 1}
            >
              {product.imgUrls.map((url, index) => (
                <SwiperSlide key={index}>
                  <img src={url} alt={`${product.name} ${index + 1}`} className="slider-image" />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img src={product.imgUrls[0]} alt={product.name} />
          )}
        </div>

        {/* Right: Product Details */}
        <div className="product-details">
          <h1>{product.name}</h1>
          <p>{product.description ?? "No description available."}</p>
          <div className="price">
            {(product.currentPrice / 100).toFixed(2)} €
            {product.oldPrice !== product.currentPrice && (
              <span className="old-price">{(product.oldPrice / 100).toFixed(2)} €</span>
            )}
          </div>
          <div className="add-to-cart">
            <Button text="Add to Cart" />
          </div>
        </div>
      </div>
    </div>
  );
}
