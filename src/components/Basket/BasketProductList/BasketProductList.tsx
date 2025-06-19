import { BasketProductCard } from "../BasketProductCard/BasketProductCard";
import { useCart } from "../../context/CartContext";
import "./BasketProductList.scss";

export function BasketProductList() {
  const { cart } = useCart();

  const products = cart?.lineItems;

  const basketCards = products?.map((item) => {
    const {
      id: itemId,
      productId,
      quantity,

      name: { en: productName },
      totalPrice: { centAmount, fractionDigits },
      variant: {
        images: [firstImg],
      },
    } = item;

    const totalPriceEuro = centAmount / 100;

    return (
      <BasketProductCard
        key={itemId}
        productName={productName}
        quantity={quantity}
        imgUrl={firstImg.url}
        totalPrice={`€${totalPriceEuro.toFixed(fractionDigits)}`}
        productId={productId}
      />
    );
  });
  return <div className="basket-list-container">{basketCards}</div>;
}
