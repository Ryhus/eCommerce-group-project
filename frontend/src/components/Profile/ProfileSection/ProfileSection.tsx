import { useId, type ReactNode } from "react";

import "./ProfileSection.scss";

type ProfileSectionProps = {
  action?: ReactNode;
  children: ReactNode;
  description?: string;
  title: string;
};

export function ProfileSection({ action, children, description, title }: ProfileSectionProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="profile-section">
      <header className="profile-section__header">
        <div>
          <h2 id={headingId}>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {action && <div className="profile-section__action">{action}</div>}
      </header>
      <div className="profile-section__body">{children}</div>
    </section>
  );
}
