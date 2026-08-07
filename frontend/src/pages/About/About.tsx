import { TeamMemberCard, type TeamMember } from "../../components/About/TeamMemberCard/TeamMemberCard";

import "./About.scss";

const team: TeamMember[] = [
  {
    name: "Yevhen Ryhus",
    isLead: true,
    role: "Team Lead & Full-Stack Developer",
    github: "https://github.com/ryhus",
    githubHandle: "ryhus",
    image: "/photos/Ryhus.jpg",
    contributions: [
      "Designed the frontend and backend architecture",
      "Led workflow and reviewed pull requests",
      "Solved complex integration challenges",
    ],
  },
  {
    name: "Natalia Andreeva",
    isLead: false,
    role: "Full-Stack Developer",
    github: "https://github.com/n-andr",
    githubHandle: "n-andr",
    image: "/photos/Nata.jpeg",
    contributions: [
      "Built application pages and routing",
      "Implemented responsive interfaces",
      "Connected frontend features with backend APIs",
    ],
  },
  {
    name: "Olha Teplova",
    isLead: false,
    role: "Frontend Developer & QA",
    github: "https://github.com/ola793",
    githubHandle: "ola793",
    image: "/photos/Olya.jpg",
    contributions: [
      "Developed reusable UI components",
      "Improved accessibility and user experience",
      "Tested critical user flows and application quality",
    ],
  },
];

const About = () => {
  return (
    <section className="about">
      <h1 className="about__title">Meet Our Team 🤝</h1>
      <ul className="about__team">
        {team.map((member) => (
          <li className="about__team-item" key={member.githubHandle}>
            <TeamMemberCard {...member} />
          </li>
        ))}
      </ul>

      <div className="about__rss">
        <a href="https://rs.school/" target="_blank" rel="noopener noreferrer">
          <img src="/logos/rs-school-logo.svg" alt="RS School Logo" className="about__rss-logo" />
        </a>
        <p className="about__rss-text">Powered by RS School 🏫</p>
      </div>
    </section>
  );
};

export default About;
