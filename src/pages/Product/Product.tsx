import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../../services/productService/productService";
import type { Product } from "../../services/productService/types";
import Button from "../../components/common/button/button";
import "./Product.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useCart } from "../../components/context/useCart";
import Message from "../../components/common/message/Message";

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { id } = useParams<{ id: string }>();
  const [productInCart, setProductInCart] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const { cart, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    fetchProductById(id!)
      .then((data) => {
        if (data) setProduct(data);
        else setError("Product not found.");
      })
      .catch((err) => setError(err.message));
  }, [id]);

  useEffect(() => {
    if (cart && id) {
      setProductInCart(cart.lineItems.some((item) => item.productId === id));
    }
  }, [cart, id]);

  if (error) return <div>{error}</div>;
  if (!product) return <div>Loading product...</div>;

  const hasDiscount = product.oldPrice > product.currentPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((product.oldPrice - product.currentPrice) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="product-page">
      <div className="product-container">
        <div className="product-page__slider">
          {product.imgUrls.length > 1 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={10}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              loop={true}
            >
              {product.imgUrls.map((url, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={url}
                    alt={`${product.name} ${index + 1}`}
                    className="slider-image"
                    onClick={() => {
                      setActiveImageIndex(index);
                      setIsModalOpen(true);
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img
              src={product.imgUrls[0]}
              alt={product.name}
              onClick={() => {
                setActiveImageIndex(0);
                setIsModalOpen(true);
              }}
            />
          )}
        </div>

        <div className="product-details">
          <h1>{product.name}</h1>
          <p>{product.description ?? "No description available."}</p>
          <div className="price">
            <span className="current-price">{(product.currentPrice / 100).toFixed(2)}€</span>
            {hasDiscount && (
              <>
                <span className="old-price">{(product.oldPrice / 100).toFixed(2)}€</span>
                <span className="discount-badge">-{discountPercentage}%</span>
              </>
            )}
          </div>
          <div className="add-to-cart">
            <Button
              disabled={productInCart}
              text="Add to Cart"
              onClick={() => {
                if (id) {
                  addToCart(id);
                }
                return cart;
              }}
            />
            <Button
              disabled={!productInCart}
              text="Remove"
              onClick={() => {
                if (id) {
                  removeFromCart(id);
                  setShowMessage(true);
                }
                return cart;
              }}
            />
          </div>
        </div>
        {showMessage && (
          <Message text="Product has been removed from the cart." onClose={() => setShowMessage(false)} />
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
              ✕
            </button>
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              initialSlide={activeImageIndex}
              loop={true}
              className="modal-slider"
            >
              {product.imgUrls.map((url, index) => (
                <SwiperSlide key={index}>
                  <img src={url} alt={`Enlarged ${index + 1}`} className="modal-image" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
}
