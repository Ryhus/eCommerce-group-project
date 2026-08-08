import { HiOutlineLocationMarker, HiPencilAlt, HiTrash } from "react-icons/hi";
import { useTranslation } from "react-i18next";

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

function getCountryName(countryCode: string, language: string) {
  try {
    return new Intl.DisplayNames([language], { type: "region" }).of(countryCode) ?? countryCode;
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
    isDefaultShipping ? "defaultShipping" : isShipping ? "shipping" : null,
    isDefaultBilling ? "defaultBilling" : isBilling ? "billing" : null,
  ].filter(Boolean) as Array<"defaultShipping" | "shipping" | "defaultBilling" | "billing">;
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
  const { i18n, t } = useTranslation("common");
  const savedAddresses = addresses ?? [];
  const description = savedAddresses.length
    ? t("profile.savedAddressesCount", { count: savedAddresses.length })
    : t("profile.savedAddressesEmptyDescription");

  return (
    <ProfileSection
      action={<Button onClick={onAdd} text={t("profile.addAddress")} />}
      description={description}
      title={t("profile.savedAddresses")}
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
            const addressName = address.streetName || t("profile.addressFallback", { number: index + 1 });

            return (
              <li className="profile-addresses__item" key={address.id ?? `${address.streetName}-${index}`}>
                <span aria-hidden="true" className="profile-addresses__icon">
                  <HiOutlineLocationMarker />
                </span>
                <div className="profile-addresses__content">
                  <h3>{addressName}</h3>
                  <p>
                    {address.postalCode} {address.city}, {getCountryName(address.country, i18n.language)}
                  </p>
                  {roles.length > 0 && (
                    <div
                      aria-label={t("profile.rolesFor", { address: addressName })}
                      className="profile-addresses__roles"
                    >
                      {roles.map((role) => (
                        <span key={role}>{t(`profile.${role}` as never)}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="profile-addresses__actions">
                  <IconButton
                    icon={<HiPencilAlt />}
                    label={`${t("profile.editAddress")} ${addressName}`}
                    onClick={() => onEdit(address)}
                    size="small"
                    variant="subtle"
                  />
                  <IconButton
                    className="profile-addresses__delete"
                    icon={<HiTrash />}
                    label={`${t("profile.deleteAddressAction")} ${addressName}`}
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
          <h3>{t("profile.noAddressesTitle")}</h3>
          <p>{t("profile.noAddressesDescription")}</p>
        </div>
      )}
    </ProfileSection>
  );
}
