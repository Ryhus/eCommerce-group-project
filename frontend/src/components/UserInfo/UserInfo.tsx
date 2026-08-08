import { useState } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { useRevalidator } from "react-router-dom";

import type { Address } from "../../services/customerService/types";
import { updateCustomer } from "../../services/customerService/customerService";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
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
  const revalidator = useRevalidator();
  const [activeEditor, setActiveEditor] = useState<ActiveEditor>(null);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

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

  const deleteAddress = async (address: Address) => {
    if (!address.id) return;
    await updateCustomer({ removeAddressId: address.id });
    await revalidator.revalidate();
  };

  return (
    <PageContainer className="profile-page">
      <Breadcrumbs crumbs={[{ name: "My account", path: "/profile" }]} includeCatalog={false} />

      <header className="profile-page__header">
        <div>
          <h1>My account</h1>
          <p>Manage your account information and delivery preferences.</p>
        </div>
        <Button
          className="profile-page__logout"
          icon={<HiOutlineLogout aria-hidden="true" />}
          onClick={() => void onLogout()}
          text="Log out"
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
            <ProfileSection description="Update your account contact details." title="Edit personal details">
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
            <ProfileSection description="Choose a new password for your account." title="Change password">
              <ProfilePasswordForm onCancel={closeEditor} onSuccess={closeEditor} />
            </ProfileSection>
          ) : (
            <ProfileSecurity onChangePassword={openPasswordEditor} />
          )}
        </div>

        <div className="profile-page__addresses">
          {activeEditor === "address" ? (
            <ProfileSection
              description="Set where you want your future purchases delivered and billed."
              title={editingAddress ? "Edit address" : "Add address"}
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
              onDelete={(address) => void deleteAddress(address)}
              onEdit={openAddressEditor}
              shippingAddressIds={shippingAddressIds}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}
