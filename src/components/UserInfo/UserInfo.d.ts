import type { Address } from "../../services/customerService/types";
import "./UserInfo.scss";
interface UserInfoProps {
  email: string;
  dateOfBirth: Date;
  firstName?: string | null;
  lastName?: string | null;
  adresses?: Address[] | null;
  defaultShippingAddressId?: string | null;
  defaultBillingAddressId?: string | null;
  shippingAddressIds?: string[] | null;
  billingAddressIds?: string[] | null;
}
export declare function UserInfo({
  firstName,
  lastName,
  email,
  dateOfBirth,
  adresses,
  shippingAddressIds,
  billingAddressIds,
  defaultShippingAddressId,
  defaultBillingAddressId,
}: UserInfoProps): import("react/jsx-runtime").JSX.Element;
export {};
