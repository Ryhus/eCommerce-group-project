import { useLoaderData, useNavigate } from "react-router-dom";
import { UserInfo } from "../../components/UserInfo/UserInfo";
import { useAuth } from "../../components/context/useAuth";
import type { CustomerResponse } from "../../services/customerService/types";

export default function UserPage() {
  const customer = useLoaderData() as CustomerResponse;
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const {
    firstName,
    lastName,
    email,
    dateOfBirth,
    addresses,
    shippingAddressIds,
    billingAddressIds,
    defaultBillingAddressId,
    defaultShippingAddressId,
  } = customer;

  return (
    <UserInfo
      firstName={firstName}
      lastName={lastName}
      email={email}
      dateOfBirth={dateOfBirth}
      adresses={addresses}
      shippingAddressIds={shippingAddressIds}
      billingAddressIds={billingAddressIds}
      defaultBillingAddressId={defaultBillingAddressId}
      defaultShippingAddressId={defaultShippingAddressId}
      onLogout={handleLogout}
    ></UserInfo>
  );
}
