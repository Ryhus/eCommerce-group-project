import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { H2 } from "../../common/headings/H2";
import { PageContainer } from "../../common/PageContainer/PageContainer";

import "./CategoryShowcase.scss";

const categoryTiles = [
  {
    labelKey: "categories.football",
    href: "/catalog/balls/football",
    image: "https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=1200&q=80",
  },
  {
    labelKey: "categories.running",
    href: "/catalog/shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
  },
  {
    labelKey: "categories.strength",
    href: "/catalog/fitness/strength",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    labelKey: "categories.yoga",
    href: "/catalog/fitness/yoga",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=1200&q=80",
  },
] as const;

const CategoryShowcase = () => {
  const { t } = useTranslation("common");

  return (
    <section aria-labelledby="category-showcase-title" className="category-showcase">
      <PageContainer className="category-showcase__container">
        <H2 id="category-showcase-title" text={t("categories.heading")} />

        <div className="category-showcase__grid">
          {categoryTiles.map(({ labelKey, href, image }) => (
            <Link className="category-showcase__tile" key={labelKey} to={href}>
              <img alt="" loading="lazy" src={image} />
              <span>{t(labelKey)}</span>
            </Link>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};

export default CategoryShowcase;
