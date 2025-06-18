interface setKeyAction {
  action: "setKey";
  key: string;
}

interface setCustomerIdAction {
  action: "setCustomerId";
  customerId: string;
}

interface setCustomerEmailAction {
  action: "setCustomerEmail";
  email: string;
}

interface setCustomerGroupAction {
  action: "setCustomerGroup";
  id: { id: string };
}

interface SetAnonymousIDAction {
  action: "setAnonymousId";
  anonymousId: string;
}

interface AddLineItemAction {
  action: "addLineItem";
  key?: string;
  productId?: string;
  variatnId?: string;
  sky?: string;
  quantity?: number;
  addedAt?: Date;
}

interface RemoveLineItemAction {
  action: "removeLineItem";
  lineItemId?: string;
  lineItemKey?: string;
  quantity?: number;
  lastModifiedAt?: Date;
}

interface LineItemVariant {
  images: { dimensions: { w: number; h: number }; url: string }[];
  id: number;
  sku: string;
}
interface LineItemTotalPrice {
  centAmount: number;
  currencyCode: "EUR" | "USD";
  fractionDigits: number;
  type: "centPrecision";
}
export interface LineItem {
  id: string;
  productId: string;
  key?: string;
  productKey?: string;
  quantity?: number;
  addedAt?: Date;
  name: { en: string };
  variant: LineItemVariant;
  totalPrice: LineItemTotalPrice;
}

export type UpdateCartActions = Array<
  | setKeyAction
  | setCustomerIdAction
  | setCustomerEmailAction
  | setCustomerGroupAction
  | SetAnonymousIDAction
  | AddLineItemAction
  | RemoveLineItemAction
>;

export interface CartDraft {
  currency: "EUR" | "USD" | "RU";
  key?: string;
  customerId?: string;
  anonymousId?: string;
}

export interface CartResponse {
  id: string;
  version: number;
  lineItems: LineItem[];
  taxMode: "Platform" | "External" | "ExternalAmount" | "Disabled";
  taxRoundingMode: "HalfEven" | "HalfUp" | "HalfDown";
  taxCalculationMode: "LineItemLevel" | "UnitPriceLevel";
  inventoryMode: "None" | "TrackOnly" | "ReserveOnOrder";
  cartState: "Active" | "Merged" | "Ordered" | "Frozen";
  shippingMode: "Single" | "Multiple";
  origin: "Customer" | "Merchant" | "Quote";
  createdAt: Date;
  lastModifiedAt: Date;
}

// export interface CartUpdateProps {
//   cartId: string;
//   cartVersion: string;
//   actions: Array<
//     | setKeyAction
//     | setCustomerIdAction
//     | setCustomerEmailAction
//     | setCustomerGroupAction
//     | SetAnonymousIDAction
//     | AddLineItemAction
//     | RemoveLineItemAction
//   >;
//   setKeyAction?: setKeyAction;
//   setCustomerIdAction?: setCustomerIdAction;
//   setEmailAction?: setCustomerEmailAction;
//   setCustomerGroupAction?: setCustomerGroupAction;
//   setAnonymousIdAction?: SetAnonymousIDAction;
//   addLineItemAction?: AddLineItemAction;
//   removeLineItemAction?: RemoveLineItemAction;
// }
