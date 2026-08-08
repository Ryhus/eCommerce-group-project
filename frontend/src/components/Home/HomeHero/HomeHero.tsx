import { PiStarFourFill } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { H1 } from "../../common/headings/H1";
import { PageContainer } from "../../common/PageContainer/PageContainer";

import "./HomeHero.scss";

const heroStats = [
  { value: "8+", labelKey: "homeHero.demoProducts" },
  { value: "4+", labelKey: "homeHero.gearCategories" },
  { value: "100%", labelKey: "homeHero.serverPriced" },
] as const;

const HERO_IMAGE = "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1600&q=85";

const HomeHero = () => {
  const { t } = useTranslation("common");

  return (
    <section className="home-hero">
      <PageContainer className="home-hero__container">
        <div className="home-hero__content">
          <H1 className="home-hero__title" text={t("homeHero.title")} />
          <p className="home-hero__description">{t("homeHero.description")}</p>
          <Link className="home-hero__cta" to="/catalog">
            {t("homeHero.cta")}
          </Link>

          <dl className="home-hero__stats">
            {heroStats.map(({ value, labelKey }) => (
              <div className="home-hero__stat" key={labelKey}>
                <dt>{value}</dt>
                <dd>{t(labelKey)}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="home-hero__media">
          <img alt={t("homeHero.imageAlt")} className="home-hero__image" src={HERO_IMAGE} />
          <PiStarFourFill aria-hidden="true" className="home-hero__sparkle home-hero__sparkle--large" />
          <PiStarFourFill aria-hidden="true" className="home-hero__sparkle home-hero__sparkle--small" />
        </div>
      </PageContainer>
    </section>
  );
};

export default HomeHero;
