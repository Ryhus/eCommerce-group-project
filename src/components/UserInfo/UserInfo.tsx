import Button from "../common/button/button";
import { H2 } from "../common/headings/H2";
import { H3 } from "../common/headings/H3";
import { HiPencilAlt, HiOutlineLocationMarker } from "react-icons/hi";
import Paragraph from "../common/paragraph/paragraph";
import type { Address } from "../../services/customerService/types";

import "./UserInfo.scss";

interface UserInfoProps {
  email: string;
  dateOfBirth: Date;
  firstName?: string | null;
  lastName?: string | null;
  adresses?: Address[] | null;
  defaultShippingAddress?: string | null;
  defaultBillingAddress?: string | null;
  shippingAddressIds?: string[] | null;
  billingAddressIds?: string[] | null;
}

export function UserInfo({
  firstName,
  lastName,
  email,
  dateOfBirth,
  adresses,
  shippingAddressIds = [],
}: UserInfoProps) {
  const billingAddresses = adresses?.map((address) => (
    <li className="user-address" key={address.id}>
      {<HiOutlineLocationMarker />}
      {`${address.streetName}, ${address.postalCode}, ${address.city}, ${address.country}`}
    </li>
  ));

  const shippingAddresses = adresses?.map((address) => {
    if (address.id && shippingAddressIds?.includes(address.id)) {
      return (
        <li className="user-address" key={address.id}>
          {<HiOutlineLocationMarker />}
          {`${address.streetName}, ${address.postalCode}, ${address.city}, ${address.country}`}
        </li>
      );
    }
  });

  return (
    <div className="user-profile-container">
      <div className="user-info-container">
        <div className="user-login-names-container">
          <H2 text={`${firstName} ${lastName}`} className="user-names"></H2>
          <Paragraph text={email} className="user-email"></Paragraph>
          <Button
            text="Edit profile"
            icon={<HiPencilAlt />}
            variant="light"
            className="edit-info-btn top-button"
          ></Button>
        </div>
        <div className="about-user-container">
          <H3 text={`Date of Birth: ${dateOfBirth}`} className="user-dob"></H3>
          <div className="addresses-container">
            {billingAddresses && (
              <div className="address-container-profile">
                <H3 text="Billing addresses:" className="address-heading"></H3>
                <ul className="user-adresses-list">{billingAddresses}</ul>
              </div>
            )}

            {shippingAddresses && (
              <div className="address-container-profile">
                <H3 text="Shipping addresses:" className="address-heading"></H3>
                <ul className="user-adresses-list">{shippingAddresses}</ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <Button
        text="Edit profile"
        icon={<HiPencilAlt />}
        variant="light"
        className="edit-info-btn right-button"
      ></Button>
    </div>
  );
}
