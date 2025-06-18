import Paragraph from "../../common/paragraph/paragraph";
import { FaMinus, FaPlus } from "react-icons/fa";
import { PiTrashFill } from "react-icons/pi";

import "./BasketProductCard.scss";

interface BasketProductCardProps {
  productId?: string;
  productName?: string;
  quantity?: number;
  imgUrl?: string;
  totalPrice?: string;
}

export function BasketProductCard({ productId, productName, quantity, imgUrl, totalPrice }: BasketProductCardProps) {
  return (
    <div className="basket-pr-container" key={productId}>
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
            <PiTrashFill />
          </div>
          <div className="pr-quantity-btns">
            <FaMinus className="basket-add-btn" />
            <Paragraph text={quantity ? quantity.toString() : "N/A"} />
            <FaPlus className="basket-remove-btn" />
          </div>
        </div>
      </div>
    </div>
  );
}
