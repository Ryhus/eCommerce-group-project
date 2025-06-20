import { useState } from "react";
import Button from "../common/button/button.js";
import { H3 } from "../common/headings/H3.js";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { AddressForm } from "./AddressFormProfile.js";
import { updateCustomer } from "../../services/customerService/customerService.js";
import { TokenService } from "../../services/TokenService.js";
import { useNavigate } from "react-router-dom";
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

export function AddressesComponent({ adresses }: AddressesProps) {
  const [isChangeAddressMode, setChangeAddressMode] = useState(false);
  const [isAddAddressMode, setAddAddressMode] = useState(false);
  const [addressId, setAddressId] = useState("");

  const navigate = useNavigate();

  const addresses = adresses?.map((address) => (
    <li className="user-address" key={address.id}>
      {<HiOutlineLocationMarker />}
      {`${address.streetName}, ${address.postalCode}, ${address.city}, ${address.country}`}
      <div className="edit-buttons">
        <Button
          className="edit-address"
          text="edit"
          onClick={() => {
            setChangeAddressMode(!isChangeAddressMode);
            if (address.id) setAddressId(address.id);
          }}
        ></Button>
        <Button
          className="edit-address"
          text="delete"
          onClick={async () => {
            if (address.id) {
              const customerId = TokenService.getCustomerId();
              const customerVersion = TokenService.getCustomerVersion();
              await updateCustomer({ customerId, customerVersion, removeAddressId: address.id });
              navigate("/profile");
            }
          }}
        ></Button>
      </div>
    </li>
  ));

  const chooseAddressFormType = function () {
    if (isChangeAddressMode) {
      return "changeAddress";
    } else {
      return "addAddress";
    }
  };

  const clearFormModeStates = function () {
    setChangeAddressMode(false);
    setAddAddressMode(false);
    setAddressId("");
  };

  return (
    <div className="address-container-profile">
      <H3 text="All addresses:" className="address-heading"></H3>
      {isChangeAddressMode || isAddAddressMode ? (
        <AddressForm formType={chooseAddressFormType()} clearMode={clearFormModeStates} addressId={addressId} />
      ) : (
        <ul className="user-adresses-list">
          {addresses}
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

export function BillingAddressesComponent({
  adresses,
  billingAddressIds,
  defaultBillingAddressId,
}: BillingAddressesProfileProps) {
  const [isChangeAddressMode, setChangeAddressMode] = useState(false);
  const [isAddAddressMode, setAddAddressMode] = useState(false);
  const [addressId, setAddressId] = useState("");

  const navigate = useNavigate();
  const billingAddresses = adresses?.map((address) => {
    if (address.id && billingAddressIds?.includes(address.id)) {
      return (
        <li
          className={address.id === defaultBillingAddressId ? "user-address default-add" : "user-address"}
          key={address.id}
        >
          {<HiOutlineLocationMarker />}
          {`${address.streetName}, ${address.postalCode}, ${address.city}, ${address.country}`}
          <div className="edit-buttons">
            <Button
              className="edit-address"
              text="edit"
              onClick={() => {
                setChangeAddressMode(!isChangeAddressMode);
                if (address.id) setAddressId(address.id);
              }}
            ></Button>
            <Button
              className="edit-address"
              text="delete"
              onClick={async () => {
                if (address.id) {
                  const customerId = TokenService.getCustomerId();
                  const customerVersion = TokenService.getCustomerVersion();
                  await updateCustomer({ customerId, customerVersion, removeBillingAddressId: address.id });
                  navigate("/profile");
                }
              }}
            ></Button>
          </div>
        </li>
      );
    }
  });

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
    setAddressId("");
  };

  return (
    <div className="address-container-profile">
      <H3 text="Billing addresses:" className="address-heading"></H3>
      {isChangeAddressMode || isAddAddressMode ? (
        <AddressForm formType={chooseAddressFormType()} clearMode={clearFormModeStates} addressId={addressId} />
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

export function ShippingAddressesComponent({
  adresses,
  shippingAddressIds,
  defaultShippingAddressId,
}: ShippingAddressesProfileProps) {
  const [isChangeAddressMode, setChangeAddressMode] = useState(false);
  const [isAddAddressMode, setAddAddressMode] = useState(false);
  const [addressId, setAddressId] = useState("");

  const navigate = useNavigate();

  const shippingAddresses = adresses?.map((address) => {
    if (address.id && shippingAddressIds?.includes(address.id)) {
      return (
        <li
          className={address.id === defaultShippingAddressId ? "user-address default-add" : "user-address"}
          key={address.id}
        >
          {<HiOutlineLocationMarker />}
          {`${address.streetName}, ${address.postalCode}, ${address.city}, ${address.country}`}
          <div className="edit-buttons">
            <Button
              className="edit-address"
              text="edit"
              onClick={() => {
                setChangeAddressMode(!isChangeAddressMode);
                if (address.id) setAddressId(address.id);
              }}
            ></Button>
            <Button
              className="edit-address"
              text="delete"
              onClick={async () => {
                if (address.id) {
                  const customerId = TokenService.getCustomerId();
                  const customerVersion = TokenService.getCustomerVersion();
                  await updateCustomer({ customerId, customerVersion, removeShippingAddressId: address.id });
                  navigate("/profile");
                }
              }}
            ></Button>
          </div>
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
    setAddressId("");
  };

  return (
    <div className="address-container-profile">
      <H3 text="Shipping addresses:" className="address-heading"></H3>
      {isChangeAddressMode || isAddAddressMode ? (
        <AddressForm formType={chooseAddressFormType()} clearMode={clearFormModeStates} addressId={addressId} />
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
