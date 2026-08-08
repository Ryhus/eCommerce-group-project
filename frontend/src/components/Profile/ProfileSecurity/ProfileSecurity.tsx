import { HiOutlineKey } from "react-icons/hi";

import Button from "../../common/button/button";
import { ProfileSection } from "../ProfileSection/ProfileSection";

import "./ProfileSecurity.scss";

type ProfileSecurityProps = {
  onChangePassword: () => void;
};

export function ProfileSecurity({ onChangePassword }: ProfileSecurityProps) {
  return (
    <ProfileSection description="Protect access to your account." title="Security">
      <div className="profile-security">
        <div className="profile-security__copy">
          <span aria-hidden="true" className="profile-security__icon">
            <HiOutlineKey />
          </span>
          <div>
            <h3>Password</h3>
            <p>Use a strong, unique password you do not use elsewhere.</p>
          </div>
        </div>
        <Button onClick={onChangePassword} text="Change" variant="light" />
      </div>
    </ProfileSection>
  );
}
