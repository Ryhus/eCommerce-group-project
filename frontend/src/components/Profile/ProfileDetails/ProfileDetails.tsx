import { HiPencilAlt } from "react-icons/hi";
import { useTranslation } from "react-i18next";

import { IconButton } from "../../common/IconButton/IconButton";
import { ProfileSection } from "../ProfileSection/ProfileSection";

import "./ProfileDetails.scss";

type ProfileDetailsProps = {
  dateOfBirth: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  onEdit: () => void;
};

function formatDateOfBirth(value: string, language: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(language, { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export function ProfileDetails({ dateOfBirth, email, firstName, lastName, onEdit }: ProfileDetailsProps) {
  const { i18n, t } = useTranslation("common");
  const details = [
    [t("profile.firstName"), firstName || t("profile.notProvided")],
    [t("profile.lastName"), lastName || t("profile.notProvided")],
    [t("profile.email"), email],
    [t("profile.dateOfBirth"), formatDateOfBirth(dateOfBirth, i18n.language)],
  ] as const;

  return (
    <ProfileSection
      action={
        <IconButton icon={<HiPencilAlt />} label={t("profile.editPersonalDetails")} onClick={onEdit} variant="subtle" />
      }
      description={t("profile.personalDetailsDescription")}
      title={t("profile.personalDetails")}
    >
      <dl className="profile-details">
        {details.map(([label, value]) => (
          <div className="profile-details__item" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </ProfileSection>
  );
}
