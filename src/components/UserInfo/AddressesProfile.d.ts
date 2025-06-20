import type { Address } from "../../services/customerService/types.js";
interface AddressesProps {
  adresses?: Address[] | null;
}
interface BillingAddressesProfileProps {
  adresses?: Address[] | null;
  defaultBillingAddressId?: string | null;
  billingAddressIds?: string[] | null;
}
interface ShippingAddressesProfileProps {
  adresses?: Address[] | null;
  defaultShippingAddressId?: string | null;
  shippingAddressIds?: string[] | null;
}
export declare function AddressesComponent({ adresses }: AddressesProps): import("react/jsx-runtime").JSX.Element;
export declare function BillingAddressesComponent({
  adresses,
  billingAddressIds,
  defaultBillingAddressId,
}: BillingAddressesProfileProps): import("react/jsx-runtime").JSX.Element;
export declare function ShippingAddressesComponent({
  adresses,
  shippingAddressIds,
  defaultShippingAddressId,
}: ShippingAddressesProfileProps): import("react/jsx-runtime").JSX.Element;
export {};
