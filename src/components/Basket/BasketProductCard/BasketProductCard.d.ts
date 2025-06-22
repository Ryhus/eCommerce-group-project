import "./BasketProductCard.scss";
interface BasketProductCardProps {
  productId?: string;
  lineItemId?: string;
  productName?: string;
  quantity?: number;
  imgUrl?: string;
  totalPrice?: string;
  discountedProductPrice?: string;
  productPrice?: string;
}
export declare function BasketProductCard({
  productId,
  lineItemId,
  productName,
  quantity,
  imgUrl,
  totalPrice,
  productPrice,
}: BasketProductCardProps): import("react/jsx-runtime").JSX.Element;
export {};
