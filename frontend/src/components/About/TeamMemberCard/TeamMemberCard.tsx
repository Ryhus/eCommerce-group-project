import { FaGithub } from "react-icons/fa";

import "./TeamMemberCard.scss";

export type TeamMember = {
  name: string;
  role: string;
  image: string;
  github: string;
  githubHandle: string;
  contributions: readonly string[];
  isLead?: boolean;
};

export function TeamMemberCard({ name, role, image, github, githubHandle, contributions, isLead = false }: TeamMember) {
  return (
    <article className="team-member-card">
      <div className="team-member-card__portrait">
        <img alt={name} loading="lazy" src={image} />
      </div>

      <div className="team-member-card__content">
        <h2 className="team-member-card__name">{name}</h2>
        <p className={`team-member-card__role${isLead ? " team-member-card__role--lead" : ""}`}>{role}</p>

        <ul className="team-member-card__contributions" aria-label={`${name}'s contributions`}>
          {contributions.map((contribution) => (
            <li key={contribution}>{contribution}</li>
          ))}
        </ul>

        <a
          aria-label={`View ${name}'s GitHub profile`}
          className="team-member-card__github"
          href={github}
          rel="noopener noreferrer"
          target="_blank"
        >
          <FaGithub aria-hidden="true" />
          <span>GitHub</span>
          <strong>@{githubHandle}</strong>
        </a>
      </div>
    </article>
  );
}
