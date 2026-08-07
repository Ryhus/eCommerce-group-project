import { PiStarFourFill } from "react-icons/pi";
import { Link } from "react-router-dom";

import { H1 } from "../../common/headings/H1";
import { PageContainer } from "../../common/PageContainer/PageContainer";

import "./HomeHero.scss";

const heroStats = [
  { value: "8+", label: "Demo products" },
  { value: "4+", label: "Gear categories" },
  { value: "100%", label: "Server-priced" },
];

const HERO_IMAGE = "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1600&q=85";

const HomeHero = () => {
  return (
    <section className="home-hero">
      <PageContainer className="home-hero__container">
        <div className="home-hero__content">
          <H1 className="home-hero__title" text="FIND GEAR THAT MATCHES YOUR GOALS" />
          <p className="home-hero__description">
            Explore dependable equipment for the field, court, gym, and every training session in between.
          </p>
          <Link className="home-hero__cta" to="/catalog">
            Shop now
          </Link>

          <dl className="home-hero__stats">
            {heroStats.map(({ value, label }) => (
              <div className="home-hero__stat" key={label}>
                <dt>{value}</dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="home-hero__media">
          <img alt="Athlete running stadium steps" className="home-hero__image" src={HERO_IMAGE} />
          <PiStarFourFill aria-hidden="true" className="home-hero__sparkle home-hero__sparkle--large" />
          <PiStarFourFill aria-hidden="true" className="home-hero__sparkle home-hero__sparkle--small" />
        </div>
      </PageContainer>
    </section>
  );
};

export default HomeHero;
