import { Link } from "react-router-dom";

import { H2 } from "../../common/headings/H2";
import { PageContainer } from "../../common/PageContainer/PageContainer";

import "./CategoryShowcase.scss";

const categoryTiles = [
  {
    name: "Football",
    href: "/catalog/balls/football",
    image: "https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Running",
    href: "/catalog/shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Strength",
    href: "/catalog/fitness/strength",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Yoga",
    href: "/catalog/fitness/yoga",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=1200&q=80",
  },
];

const CategoryShowcase = () => {
  return (
    <section aria-labelledby="category-showcase-title" className="category-showcase">
      <PageContainer className="category-showcase__container">
        <H2 id="category-showcase-title" text="BROWSE BY SPORT" />

        <div className="category-showcase__grid">
          {categoryTiles.map(({ name, href, image }) => (
            <Link className="category-showcase__tile" key={name} to={href}>
              <img alt="" loading="lazy" src={image} />
              <span>{name}</span>
            </Link>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};

export default CategoryShowcase;
