import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiOutlineLogout } from "react-icons/hi";
import { useRevalidator } from "react-router-dom";

import type { Address } from "../../services/customerService/types";
import { updateCustomer } from "../../services/customerService/customerService";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { DeleteAddressDialog } from "../Profile/DeleteAddressDialog/DeleteAddressDialog";
import { ProfileAddressForm } from "../Profile/ProfileAddressForm/ProfileAddressForm";
import { ProfileAddresses } from "../Profile/ProfileAddresses/ProfileAddresses";
import { ProfileDetails } from "../Profile/ProfileDetails/ProfileDetails";
import { ProfileDetailsForm } from "../Profile/ProfileDetailsForm/ProfileDetailsForm";
import { ProfileOverview } from "../Profile/ProfileOverview/ProfileOverview";
import { ProfilePasswordForm } from "../Profile/ProfilePasswordForm/ProfilePasswordForm";
import { ProfileSection } from "../Profile/ProfileSection/ProfileSection";
import { ProfileSecurity } from "../Profile/ProfileSecurity/ProfileSecurity";
import Button from "../common/button/button";
import { PageContainer } from "../common/PageContainer/PageContainer";

import "./UserInfo.scss";

interface UserInfoProps {
  email: string;
  dateOfBirth: string;
  firstName?: string | null;
  lastName?: string | null;
  adresses?: Address[] | null;
  defaultShippingAddressId?: string | null;
  defaultBillingAddressId?: string | null;
  shippingAddressIds?: string[] | null;
  billingAddressIds?: string[] | null;
  onLogout: () => Promise<void>;
}

type ActiveEditor = "address" | "details" | "password" | null;

export function UserInfo({
  firstName,
  lastName,
  email,
  dateOfBirth,
  adresses,
  shippingAddressIds = [],
  billingAddressIds = [],
  defaultShippingAddressId,
  defaultBillingAddressId,
  onLogout,
}: UserInfoProps) {
  const { t } = useTranslation("common");
  const revalidator = useRevalidator();
  const [activeEditor, setActiveEditor] = useState<ActiveEditor>(null);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [isDeletingAddress, setIsDeletingAddress] = useState(false);

  const closeEditor = () => {
    setActiveEditor(null);
    setEditingAddress(null);
  };

  const openDetailsEditor = () => {
    setEditingAddress(null);
    setActiveEditor("details");
  };

  const openPasswordEditor = () => {
    setEditingAddress(null);
    setActiveEditor("password");
  };

  const openAddressEditor = (address?: Address) => {
    setEditingAddress(
      address
        ? {
            ...address,
            isDefaultBilling: address.isDefaultBilling || address.id === defaultBillingAddressId,
            isDefaultShipping: address.isDefaultShipping || address.id === defaultShippingAddressId,
          }
        : null
    );
    setActiveEditor("address");
  };

  const requestAddressDeletion = (address: Address) => {
    setDeleteError("");
    setAddressToDelete(address);
  };

  const cancelAddressDeletion = () => {
    setDeleteError("");
    setAddressToDelete(null);
  };

  const confirmAddressDeletion = async () => {
    if (!addressToDelete?.id) return;

    try {
      setDeleteError("");
      setIsDeletingAddress(true);
      await updateCustomer({ removeAddressId: addressToDelete.id });
      await revalidator.revalidate();
      setAddressToDelete(null);
    } catch {
      setDeleteError(t("profile.unableToDeleteAddress"));
    } finally {
      setIsDeletingAddress(false);
    }
  };

  return (
    <PageContainer className="profile-page">
      <Breadcrumbs crumbs={[{ name: t("profile.breadcrumb"), path: "/profile" }]} includeCatalog={false} />

      <header className="profile-page__header">
        <div>
          <h1>{t("profile.title")}</h1>
          <p>{t("profile.description")}</p>
        </div>
        <Button
          className="profile-page__logout"
          icon={<HiOutlineLogout aria-hidden="true" />}
          onClick={() => void onLogout()}
          text={t("profile.logout")}
          variant="light"
        />
      </header>

      <ProfileOverview
        email={email}
        firstName={firstName}
        lastName={lastName}
        onChangePassword={openPasswordEditor}
        onEditProfile={openDetailsEditor}
      />

      <div className="profile-page__sections">
        <div>
          {activeEditor === "details" ? (
            <ProfileSection
              description={t("profile.personalDetailsDescription")}
              title={t("profile.editPersonalDetails")}
            >
              <ProfileDetailsForm
                dateOfBirth={dateOfBirth}
                email={email}
                firstName={firstName}
                lastName={lastName}
                onCancel={closeEditor}
                onSuccess={closeEditor}
              />
            </ProfileSection>
          ) : (
            <ProfileDetails
              dateOfBirth={dateOfBirth}
              email={email}
              firstName={firstName}
              lastName={lastName}
              onEdit={openDetailsEditor}
            />
          )}
        </div>

        <div>
          {activeEditor === "password" ? (
            <ProfileSection
              description={t("profile.changePasswordDescription")}
              title={t("profile.changePasswordTitle")}
            >
              <ProfilePasswordForm onCancel={closeEditor} onSuccess={closeEditor} />
            </ProfileSection>
          ) : (
            <ProfileSecurity onChangePassword={openPasswordEditor} />
          )}
        </div>

        <div className="profile-page__addresses">
          {activeEditor === "address" ? (
            <ProfileSection
              description={t("profile.savedAddressesDescription")}
              title={editingAddress ? t("profile.editAddressTitle") : t("profile.addAddressTitle")}
            >
              <ProfileAddressForm address={editingAddress} onCancel={closeEditor} onSuccess={closeEditor} />
            </ProfileSection>
          ) : (
            <ProfileAddresses
              addresses={adresses}
              billingAddressIds={billingAddressIds}
              defaultBillingAddressId={defaultBillingAddressId}
              defaultShippingAddressId={defaultShippingAddressId}
              onAdd={() => openAddressEditor()}
              onDelete={requestAddressDeletion}
              onEdit={openAddressEditor}
              shippingAddressIds={shippingAddressIds}
            />
          )}
        </div>
      </div>

      {addressToDelete && (
        <DeleteAddressDialog
          addressName={addressToDelete.streetName || "This address"}
          error={deleteError}
          isDeleting={isDeletingAddress}
          onCancel={cancelAddressDeletion}
          onConfirm={() => void confirmAddressDeletion()}
        />
      )}
    </PageContainer>
  );
}
