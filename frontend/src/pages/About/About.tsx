import { TeamMemberCard, type TeamMember } from "../../components/About/TeamMemberCard/TeamMemberCard";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { PageContainer } from "../../components/common/PageContainer/PageContainer";

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
    <PageContainer className="about-page">
      <Breadcrumbs crumbs={[{ name: "About", path: "/about" }]} includeCatalog={false} />
      <section aria-labelledby="about-title" className="about-page__main">
        <header className="about-page__intro">
          <h1 id="about-title">Meet our team</h1>
          <p>The people behind Sport Gear and the work that brought the store to life.</p>
        </header>

        <ul className="about-page__team">
          {team.map((member) => (
            <li className="about-page__team-item" key={member.githubHandle}>
              <TeamMemberCard {...member} />
            </li>
          ))}
        </ul>
      </section>
    </PageContainer>
  );
};

export default About;
