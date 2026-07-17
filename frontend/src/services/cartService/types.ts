export interface Money {
  amount: number;
  currency: "EUR";
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  image: string | null;
  quantity: number;
  unitPrice: Money;
  lineTotal: Money;
}

export interface CartResponse {
  id: string;
  items: CartItem[];
  totalQuantity: number;
  subtotal: Money;
  discount: Money;
  total: Money;
  discountCode: { code: string; description: string } | null;
}
