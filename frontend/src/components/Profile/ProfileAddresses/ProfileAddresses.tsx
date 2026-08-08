import { HiOutlineLocationMarker, HiPencilAlt, HiTrash } from "react-icons/hi";

import type { Address } from "../../../services/customerService/types";
import { IconButton } from "../../common/IconButton/IconButton";
import Button from "../../common/button/button";
import { ProfileSection } from "../ProfileSection/ProfileSection";

import "./ProfileAddresses.scss";

type ProfileAddressesProps = {
  addresses?: Address[] | null;
  billingAddressIds?: string[] | null;
  defaultBillingAddressId?: string | null;
  defaultShippingAddressId?: string | null;
  onAdd: () => void;
  onDelete: (address: Address) => void;
  onEdit: (address: Address) => void;
  shippingAddressIds?: string[] | null;
};

function getCountryName(countryCode: string) {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode) ?? countryCode;
  } catch {
    return countryCode;
  }
}

function getAddressRoles(
  address: Address,
  billingAddressIds: string[],
  shippingAddressIds: string[],
  defaultBillingAddressId?: string | null,
  defaultShippingAddressId?: string | null
) {
  const isDefaultBilling = address.isDefaultBilling || address.id === defaultBillingAddressId;
  const isDefaultShipping = address.isDefaultShipping || address.id === defaultShippingAddressId;
  const isBilling = address.isBilling || (address.id ? billingAddressIds.includes(address.id) : false);
  const isShipping = address.isShipping || (address.id ? shippingAddressIds.includes(address.id) : false);

  return [
    isDefaultShipping ? "Default shipping" : isShipping ? "Shipping" : null,
    isDefaultBilling ? "Default billing" : isBilling ? "Billing" : null,
  ].filter(Boolean) as string[];
}

export function ProfileAddresses({
  addresses = [],
  billingAddressIds = [],
  defaultBillingAddressId,
  defaultShippingAddressId,
  onAdd,
  onDelete,
  onEdit,
  shippingAddressIds = [],
}: ProfileAddressesProps) {
  const savedAddresses = addresses ?? [];
  const description = savedAddresses.length
    ? `${savedAddresses.length} saved ${savedAddresses.length === 1 ? "address" : "addresses"}.`
    : "Add an address for future deliveries and billing.";

  return (
    <ProfileSection
      action={<Button onClick={onAdd} text="Add address" />}
      description={description}
      title="Saved addresses"
    >
      {savedAddresses.length ? (
        <ul className="profile-addresses">
          {savedAddresses.map((address, index) => {
            const roles = getAddressRoles(
              address,
              billingAddressIds ?? [],
              shippingAddressIds ?? [],
              defaultBillingAddressId,
              defaultShippingAddressId
            );
            const addressName = address.streetName || `Address ${index + 1}`;

            return (
              <li className="profile-addresses__item" key={address.id ?? `${address.streetName}-${index}`}>
                <span aria-hidden="true" className="profile-addresses__icon">
                  <HiOutlineLocationMarker />
                </span>
                <div className="profile-addresses__content">
                  <h3>{addressName}</h3>
                  <p>
                    {address.postalCode} {address.city}, {getCountryName(address.country)}
                  </p>
                  {roles.length > 0 && (
                    <div className="profile-addresses__roles" aria-label={`Roles for ${addressName}`}>
                      {roles.map((role) => (
                        <span key={role}>{role}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="profile-addresses__actions">
                  <IconButton
                    icon={<HiPencilAlt />}
                    label={`Edit ${addressName}`}
                    onClick={() => onEdit(address)}
                    size="small"
                    variant="subtle"
                  />
                  <IconButton
                    className="profile-addresses__delete"
                    icon={<HiTrash />}
                    label={`Delete ${addressName}`}
                    onClick={() => onDelete(address)}
                    size="small"
                    variant="subtle"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="profile-addresses__empty">
          <span aria-hidden="true">
            <HiOutlineLocationMarker />
          </span>
          <h3>No saved addresses yet</h3>
          <p>Add your first address to make future shopping faster.</p>
        </div>
      )}
    </ProfileSection>
  );
}
