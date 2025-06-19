import Paragraph from "../../common/paragraph/paragraph";
import { FaMinus, FaPlus } from "react-icons/fa";
import { PiTrashFill } from "react-icons/pi";
import { useCart } from "../../context/CartContext";

import "./BasketProductCard.scss";

interface BasketProductCardProps {
  productId?: string;
  lineItemId?: string;
  productName?: string;
  quantity?: number;
  imgUrl?: string;
  totalPrice?: string;
}

export function BasketProductCard({
  productId,
  lineItemId,
  productName,
  quantity,
  imgUrl,
  totalPrice,
}: BasketProductCardProps) {
  const { addToCart, removeFromCart } = useCart();

  return (
    <div className="basket-pr-container" key={lineItemId}>
      <div className="pr-img-container">
        <img src={imgUrl}></img>
      </div>
      <div className="pr-info-container">
        <div className="pr-text-container">
          <div className="pr-description-container">
            <Paragraph className="basket-pr-name" text={productName ? productName : ""}></Paragraph>
          </div>
          <Paragraph className="basket-pr-price" text={totalPrice ? totalPrice.toString() : "N/A"}></Paragraph>
        </div>
        <div className="pr-actions-container">
          <div className="delete-pr-btn">
            <PiTrashFill
              onClick={() => {
                if (productId) removeFromCart(productId);
              }}
            />
          </div>
          <div className="pr-quantity-btns">
            <FaMinus
              className="basket-add-btn"
              onClick={() => {
                if (productId) removeFromCart(productId, 1);
              }}
            />
            <Paragraph text={quantity ? quantity.toString() : "N/A"} />
            <FaPlus
              className="basket-remove-btn"
              onClick={() => {
                if (productId) addToCart(productId);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
