import { HiOutlineKey, HiPencilAlt } from "react-icons/hi";
import { useTranslation } from "react-i18next";

import Button from "../../common/button/button";

import "./ProfileOverview.scss";

type ProfileOverviewProps = {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  onChangePassword: () => void;
  onEditProfile: () => void;
};

function getInitials(firstName?: string | null, lastName?: string | null) {
  const initials = [firstName, lastName]
    .filter(Boolean)
    .map((name) => name!.trim().charAt(0).toUpperCase())
    .join("");

  return initials || "SG";
}

export function ProfileOverview({ email, firstName, lastName, onChangePassword, onEditProfile }: ProfileOverviewProps) {
  const { t } = useTranslation("common");
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || t("profile.fallbackName");

  return (
    <section aria-labelledby="profile-overview-title" className="profile-overview">
      <div aria-hidden="true" className="profile-overview__avatar">
        {getInitials(firstName, lastName)}
      </div>

      <div className="profile-overview__identity">
        <h2 id="profile-overview-title">{fullName}</h2>
        <p>{email}</p>
      </div>

      <div className="profile-overview__actions">
        <Button
          icon={<HiOutlineKey aria-hidden="true" />}
          onClick={onChangePassword}
          text={t("profile.changePassword")}
          variant="light"
        />
        <Button icon={<HiPencilAlt aria-hidden="true" />} onClick={onEditProfile} text={t("profile.editProfile")} />
      </div>
    </section>
  );
}
