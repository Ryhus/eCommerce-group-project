import { useLoaderData } from "react-router-dom";
import { UserInfo } from "../../components/UserInfo/UserInfo";
import type { CustomerResponse } from "../../services/customerService/types";

export default function UserPage() {
  const { firstName, lastName, email, dateOfBirth, addresses, shippingAddressIds, billingAddressIds } =
    useLoaderData<CustomerResponse>();

  return (
    <UserInfo
      firstName={firstName}
      lastName={lastName}
      email={email}
      dateOfBirth={dateOfBirth}
      adresses={addresses}
      shippingAddressIds={shippingAddressIds}
      billingAddressIds={billingAddressIds}
    ></UserInfo>
  );
}
