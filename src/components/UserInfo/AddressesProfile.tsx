import { useState } from "react";
import Button from "../common/button/button.js";
import { H3 } from "../common/headings/H3.js";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { AddressForm } from "./AddressFormProfile.js";
import type { Address } from "../../services/customerService/types.js";

interface BillingAddressesProfileProps {
  adresses?: Address[] | null;
  defaultBillingAddress?: string | null;
  billingAddressIds?: string[] | null;
}

interface ShippingAddressesProfileProps {
  adresses?: Address[] | null;
  defaultShippingAddress?: string | null;
  shippingAddressIds?: string[] | null;
}

export function BillingAddressesComponent({ adresses }: BillingAddressesProfileProps) {
  const [isChangeAddressMode, setChangeAddressMode] = useState(false);
  const [isAddAddressMode, setAddAddressMode] = useState(false);

  const billingAddresses = adresses?.map((address) => (
    <li className="user-address" key={address.id}>
      {<HiOutlineLocationMarker />}
      {`${address.streetName}, ${address.postalCode}, ${address.city}, ${address.country}`}
      <Button className="edit-address" text="edit" onClick={() => setChangeAddressMode(!isChangeAddressMode)}></Button>
    </li>
  ));

  const chooseAddressFormType = function () {
    if (isChangeAddressMode) {
      return "changeBillingAddress";
    } else {
      return "addBillingAddress";
    }
  };

  const clearFormModeStates = function () {
    setChangeAddressMode(false);
    setAddAddressMode(false);
  };

  return (
    <div className="address-container-profile">
      <H3 text="Billing addresses:" className="address-heading"></H3>
      {isChangeAddressMode && isAddAddressMode ? (
        <AddressForm formType={chooseAddressFormType()} clearMode={clearFormModeStates} />
      ) : (
        <ul className="user-adresses-list">
          {billingAddresses}
          <Button
            className="add-address-btn"
            variant="light"
            text="add new address"
            onClick={() => setAddAddressMode(!isChangeAddressMode)}
          ></Button>
        </ul>
      )}
    </div>
  );
}

export function ShippingAddressesComponent({ adresses, shippingAddressIds }: ShippingAddressesProfileProps) {
  const [isChangeAddressMode, setChangeAddressMode] = useState(false);
  const [isAddAddressMode, setAddAddressMode] = useState(false);

  const shippingAddresses = adresses?.map((address) => {
    if (address.id && shippingAddressIds?.includes(address.id)) {
      return (
        <li className="user-address" key={address.id}>
          {<HiOutlineLocationMarker />}
          {`${address.streetName}, ${address.postalCode}, ${address.city}, ${address.country}`}
          <Button className="edit-address" text="edit"></Button>
        </li>
      );
    }
  });

  const chooseAddressFormType = function () {
    if (isChangeAddressMode) {
      return "changeShippingAddress";
    } else {
      return "addShippingAddress";
    }
  };

  const clearFormModeStates = function () {
    setChangeAddressMode(false);
    setAddAddressMode(false);
  };

  return (
    <div className="address-container-profile">
      <H3 text="Shipping addresses:" className="address-heading"></H3>
      {isChangeAddressMode && isAddAddressMode ? (
        <AddressForm formType={chooseAddressFormType()} clearMode={clearFormModeStates} />
      ) : (
        <ul className="user-adresses-list">
          {shippingAddresses}
          <Button
            className="add-address-btn"
            variant="light"
            text="add new address"
            onClick={() => setAddAddressMode(!isChangeAddressMode)}
          ></Button>
        </ul>
      )}
    </div>
  );
}
