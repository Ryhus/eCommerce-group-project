import { HiOutlineKey } from "react-icons/hi";
import { useTranslation } from "react-i18next";

import Button from "../../common/button/button";
import { ProfileSection } from "../ProfileSection/ProfileSection";

import "./ProfileSecurity.scss";

type ProfileSecurityProps = {
  onChangePassword: () => void;
};

export function ProfileSecurity({ onChangePassword }: ProfileSecurityProps) {
  const { t } = useTranslation("common");

  return (
    <ProfileSection description={t("profile.securityDescription")} title={t("profile.security")}>
      <div className="profile-security">
        <div className="profile-security__copy">
          <span aria-hidden="true" className="profile-security__icon">
            <HiOutlineKey />
          </span>
          <div>
            <h3>{t("profile.password")}</h3>
            <p>{t("profile.passwordDescription")}</p>
          </div>
        </div>
        <Button onClick={onChangePassword} text={t("profile.change")} variant="light" />
      </div>
    </ProfileSection>
  );
}
