import "./About.scss";

const team = [
  {
    name: "Yevhen Ryhus",
    isLead: true,
    bio: "Our team lead and the driving force behind every decision. Kept the vision clear and spirits high.",
    github: "https://github.com/ryhus",
    image: "public/photos/Ryhus.jpg",
    contributions:
      "Organized workflow, reviewed all pull requests, ensured code quality, and resolved complex logic challenges.",
  },
  {
    name: "Natalia Andreeva",
    isLead: false,
    bio: "Always focused and consistent, Nataliia shaped much of the project’s UI logic and pixel-perfect layout.",
    github: "https://github.com/n-andr",
    image: "public/photos/Nata.jpeg",
    contributions: "Implemented page structure, routing logic, and ensured responsive design across views.",
  },
  {
    name: "Olha Teplova",
    isLead: false,
    bio: "Creative and detail-oriented. Olha added the finishing touches and kept accessibility and UX in focus.",
    github: "https://github.com/ola793",
    image: "public/photos/Olya.jpg",
    contributions: "Finalized About Us page, styled components with SCSS, and worked on user flow improvements.",
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
            <p className="about__bio">{member.bio}</p>
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
