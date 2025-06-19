import { BasketProductCard } from "../BasketProductCard/BasketProductCard";
import { useCart } from "../../context/CartContext";
import "./BasketProductList.scss";

export function BasketProductList() {
  const { cart } = useCart();

  const products = cart?.lineItems;
  console.log(cart);
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
  return <div className="basket-list-container">{basketCards}</div>;
}
