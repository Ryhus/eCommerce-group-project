import { HiPencilAlt } from "react-icons/hi";

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

function formatDateOfBirth(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export function ProfileDetails({ dateOfBirth, email, firstName, lastName, onEdit }: ProfileDetailsProps) {
  const details = [
    ["First name", firstName || "Not provided"],
    ["Last name", lastName || "Not provided"],
    ["Email", email],
    ["Date of birth", formatDateOfBirth(dateOfBirth)],
  ] as const;

  return (
    <ProfileSection
      action={<IconButton icon={<HiPencilAlt />} label="Edit personal details" onClick={onEdit} variant="subtle" />}
      description="Information used for your account."
      title="Personal details"
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
