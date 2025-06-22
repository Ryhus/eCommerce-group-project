import { useState, useEffect } from "react";
import Link from "../../common/link/link";
import { BasketProductCard } from "../BasketProductCard/BasketProductCard";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/useCart";
import "./BasketProductList.scss";

export function BasketProductList() {
  const { cart } = useCart();
  const [productInCart, setProductInCart] = useState(false);

  const products = cart?.lineItems;
  const navigate = useNavigate();
  useEffect(() => {
    if (products) {
      setProductInCart(products.length > 0);
    }
  }, [products]);

  const basketCards = products?.map((item) => {
    const {
      id: itemId,
      productId,
      quantity,

      name: { en: productName },
      price: {
        discounted: {
          value: { centAmount: discountedItemCentPrice, fractionDigits: discountedFraction },
        },
        value: { centAmount: itemCentPrice, fractionDigits: itemFraction },
      },
      totalPrice: { centAmount: totalCentPrice, fractionDigits },
      variant: {
        images: [firstImg],
      },
    } = item;
    const itemPrice = itemCentPrice / 100;
    const discountedItemPrice = discountedItemCentPrice / 100;
    const totalPriceEuro = totalCentPrice / 100;

    const currentPrice = discountedItemPrice ? discountedItemPrice : itemPrice;
    const curretFraction = discountedFraction ? discountedFraction : itemFraction;

    return (
      <BasketProductCard
        key={itemId}
        productName={productName}
        quantity={quantity}
        imgUrl={firstImg.url}
        productId={productId}
        productPrice={`Price: €${currentPrice.toFixed(curretFraction)}`}
        totalPrice={`Total: €${totalPriceEuro.toFixed(fractionDigits)}`}
      />
    );
  });

  return (
    <div className="basket-list-container">
      {productInCart ? (
        basketCards
      ) : (
        <Link
          className="cart-to-catalog-link"
          text="Empty cart? Click on me and buy our products 🥎"
          onClick={(e) => {
            e.preventDefault();
            navigate("/catalog");
          }}
          href={"/catalog"}
        />
      )}
    </div>
  );
}
