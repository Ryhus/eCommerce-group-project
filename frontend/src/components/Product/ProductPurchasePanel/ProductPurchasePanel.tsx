import { useState } from "react";

import type { Product } from "../../../services/productService/types";
import Button from "../../common/button/button";
import Message from "../../common/message/Message";
import { useCart } from "../../context/useCart";
import { QuantitySelector } from "../QuantitySelector/QuantitySelector";

import "./ProductPurchasePanel.scss";

type ProductPurchasePanelProps = {
  product: Product;
};

const moneyFormatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; variant: "error" | "success" } | null>(null);

  const hasDiscount = product.oldPrice > product.currentPrice;
  const discount = hasDiscount ? Math.round(((product.oldPrice - product.currentPrice) / product.oldPrice) * 100) : 0;

  const addProduct = async () => {
    setIsAdding(true);
    setFeedback(null);
    try {
      await addToCart(product.id, quantity);
      setFeedback({
        text: `${quantity} × ${product.name} added to your cart.`,
        variant: "success",
      });
      setQuantity(1);
    } catch {
      setFeedback({ text: "We couldn't add this product. Please try again.", variant: "error" });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <section aria-labelledby="product-title" className="product-purchase-panel">
      <h1 id="product-title">{product.name}</h1>

      <div aria-label="Product price" className="product-purchase-panel__prices">
        <span className="product-purchase-panel__current-price">
          {moneyFormatter.format(product.currentPrice / 100)}
        </span>
        {hasDiscount && (
          <>
            <span
              aria-label={`Previous price ${moneyFormatter.format(product.oldPrice / 100)}`}
              className="product-purchase-panel__old-price"
            >
              {moneyFormatter.format(product.oldPrice / 100)}
            </span>
            <span className="product-purchase-panel__discount">-{discount}%</span>
          </>
        )}
      </div>

      <p className="product-purchase-panel__description">
        {product.description || "Product details will be available soon."}
      </p>

      <div className="product-purchase-panel__actions">
        <QuantitySelector disabled={isAdding} onChange={setQuantity} value={quantity} />
        <Button
          className="product-purchase-panel__add"
          disabled={isAdding}
          onClick={() => void addProduct()}
          text={isAdding ? "Adding…" : "Add to Cart"}
        />
      </div>

      {feedback && <Message onClose={() => setFeedback(null)} text={feedback.text} variant={feedback.variant} />}
    </section>
  );
}
