import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { Product } from "../../../services/productService/types";
import { formatMoney } from "../../../utils/formatMoney";
import Button from "../../common/button/button";
import Message from "../../common/message/Message";
import { useCart } from "../../context/useCart";
import { QuantitySelector } from "../QuantitySelector/QuantitySelector";

import "./ProductPurchasePanel.scss";

type ProductPurchasePanelProps = {
  product: Product;
};

type PurchaseFeedback = { variant: "error" } | { variant: "success"; quantity: number; productName: string };

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const { i18n, t } = useTranslation("common");
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState<PurchaseFeedback | null>(null);

  const hasDiscount = product.oldPrice > product.currentPrice;
  const discount = hasDiscount ? Math.round(((product.oldPrice - product.currentPrice) / product.oldPrice) * 100) : 0;
  const language = i18n.resolvedLanguage ?? i18n.language;
  const currentPrice = formatMoney(product.currentPrice, language);
  const oldPrice = formatMoney(product.oldPrice, language);
  const feedbackText = feedback
    ? feedback.variant === "success"
      ? t("productPurchase.added", { quantity: feedback.quantity, name: feedback.productName })
      : t("productPurchase.addError")
    : null;

  const addProduct = async () => {
    setIsAdding(true);
    setFeedback(null);
    try {
      await addToCart(product.id, quantity);
      setFeedback({
        variant: "success",
        quantity,
        productName: product.name,
      });
      setQuantity(1);
    } catch {
      setFeedback({ variant: "error" });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <section aria-labelledby="product-title" className="product-purchase-panel">
      <h1 id="product-title">{product.name}</h1>

      <div aria-label={t("productPurchase.price")} className="product-purchase-panel__prices">
        <span className="product-purchase-panel__current-price">{currentPrice}</span>
        {hasDiscount && (
          <>
            <span
              aria-label={t("productPurchase.previousPrice", { price: oldPrice })}
              className="product-purchase-panel__old-price"
            >
              {oldPrice}
            </span>
            <span className="product-purchase-panel__discount">-{discount}%</span>
          </>
        )}
      </div>

      <p className="product-purchase-panel__description">
        {product.description || t("productPurchase.detailsUnavailable")}
      </p>

      <div className="product-purchase-panel__actions">
        <QuantitySelector disabled={isAdding} onChange={setQuantity} value={quantity} />
        <Button
          className="product-purchase-panel__add"
          disabled={isAdding}
          onClick={() => void addProduct()}
          text={isAdding ? t("productPurchase.adding") : t("productPurchase.addToCart")}
        />
      </div>

      {feedback && feedbackText && (
        <Message onClose={() => setFeedback(null)} text={feedbackText} variant={feedback.variant} />
      )}
    </section>
  );
}
