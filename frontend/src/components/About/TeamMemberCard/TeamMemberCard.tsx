import { FaGithub } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import "./TeamMemberCard.scss";

export type TeamMember = {
  name: string;
  role: string;
  image: string;
  github: string;
  githubHandle: string;
  contributions: readonly string[];
  contributionKeys?: readonly string[];
  roleKey?: string;
  isLead?: boolean;
};

export function TeamMemberCard({
  name,
  role,
  roleKey,
  image,
  github,
  githubHandle,
  contributions,
  contributionKeys,
  isLead = false,
}: TeamMember) {
  const { t } = useTranslation("common");
  const translatedRole = roleKey ? t(roleKey as never) : role;

  return (
    <article className="team-member-card">
      <div className="team-member-card__portrait">
        <img alt={name} loading="lazy" src={image} />
      </div>

      <div className="team-member-card__content">
        <h2 className="team-member-card__name">{name}</h2>
        <p className={`team-member-card__role${isLead ? " team-member-card__role--lead" : ""}`}>{translatedRole}</p>

        <ul className="team-member-card__contributions" aria-label={t("about.contributions", { name })}>
          {contributions.map((contribution, index) => (
            <li key={contribution}>{contributionKeys?.[index] ? t(contributionKeys[index] as never) : contribution}</li>
          ))}
        </ul>

        <a
          aria-label={t("about.githubProfile", { name })}
          className="team-member-card__github"
          href={github}
          rel="noopener noreferrer"
          target="_blank"
        >
          <FaGithub aria-hidden="true" />
          <span>{t("about.github")}</span>
          <strong>@{githubHandle}</strong>
        </a>
      </div>
    </article>
  );
}
