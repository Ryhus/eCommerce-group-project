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
