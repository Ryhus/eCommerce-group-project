import "./About.scss";

const team = [
  {
    name: "Yevhen Ryhus",
    isLead: true,
    role: "Team Lead & Full-Stack Developer",
    github: "https://github.com/ryhus",
    image: "/photos/Ryhus.jpg",
    contributions:
      "Designed the frontend and backend architecture; led workflow and reviewed pull requests; solved complex integration challenges.",
  },
  {
    name: "Natalia Andreeva",
    isLead: false,
    role: "Full-Stack Developer",
    github: "https://github.com/n-andr",
    image: "/photos/Nata.jpeg",
    contributions:
      "Built application pages and routing; implemented responsive interfaces; connected frontend features with backend APIs.",
  },
  {
    name: "Olha Teplova",
    isLead: false,
    role: "Frontend Developer & QA",
    github: "https://github.com/ola793",
    image: "/photos/Olya.jpg",
    contributions:
      "Developed reusable UI components; improved accessibility and user experience; tested critical user flows and application quality.",
  },
];

const About = () => {
  return (
    <section className="about">
      <h1 className="about__title">Meet Our Team 🤝</h1>
      <div className="about__team">
        {team.map((member, index) => (
          <div className="about__card" key={index}>
            <img src={member.image} alt={member.name} className="about__photo" />
            <h2 className="about__name">{member.name}</h2>
            {member.isLead && <p className="about__lead-tag">Team Lead</p>}
            <p className="about__contributions">
              <strong>Contributions:</strong> {member.contributions}
            </p>
            <a href={member.github} target="_blank" rel="noopener noreferrer" className="about__github">
              <img src="/logos/gh-logo.png" alt="Github Logo" className="about__gh-logo" />
            </a>
          </div>
        ))}
      </div>

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
