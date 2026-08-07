import { useRef } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { IoCheckmarkCircle } from "react-icons/io5";

import { H2 } from "../../common/headings/H2";
import { IconButton } from "../../common/IconButton/IconButton";
import { PageContainer } from "../../common/PageContainer/PageContainer";

import "./StoreHighlights.scss";

const highlights = [
  {
    title: "Server-priced catalog",
    description: "Product prices, discounts, and availability come from the NestJS API instead of browser storage.",
  },
  {
    title: "A cart that follows you",
    description: "Start shopping anonymously and keep the same items when you create an account or sign in.",
  },
  {
    title: "Responsive by design",
    description:
      "The storefront is structured for phones, tablets, and desktop screens using one accessible interface.",
  },
  {
    title: "Secure account sessions",
    description:
      "HttpOnly cookies, rotating refresh sessions, and CSRF protection keep credentials out of frontend code.",
  },
];

const StoreHighlights = () => {
  const listRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: -1 | 1) => {
    const list = listRef.current;
    if (!list) return;

    const distance = list.clientWidth > 0 ? list.clientWidth * 0.8 : 360;
    list.scrollBy({ behavior: "smooth", left: direction * distance });
  };

  return (
    <section aria-labelledby="store-highlights-title" className="store-highlights">
      <PageContainer>
        <div className="store-highlights__header">
          <H2 id="store-highlights-title" text="WHY SPORT GEAR" />
          <div className="store-highlights__controls">
            <IconButton icon={<FiArrowLeft />} label="Previous advantages" onClick={() => scroll(-1)} size="small" />
            <IconButton icon={<FiArrowRight />} label="Next advantages" onClick={() => scroll(1)} size="small" />
          </div>
        </div>

        <div aria-label="Store advantages" className="store-highlights__list" ref={listRef} role="list">
          {highlights.map(({ title, description }) => (
            <article className="store-highlights__card" key={title} role="listitem">
              <IoCheckmarkCircle aria-hidden="true" className="store-highlights__check" />
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};

export default StoreHighlights;
