import { useRef } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useTranslation } from "react-i18next";

import { H2 } from "../../common/headings/H2";
import { IconButton } from "../../common/IconButton/IconButton";
import { PageContainer } from "../../common/PageContainer/PageContainer";

import "./StoreHighlights.scss";

const highlights = [
  {
    titleKey: "highlights.serverTitle",
    descriptionKey: "highlights.serverDescription",
  },
  {
    titleKey: "highlights.cartTitle",
    descriptionKey: "highlights.cartDescription",
  },
  {
    titleKey: "highlights.responsiveTitle",
    descriptionKey: "highlights.responsiveDescription",
  },
  {
    titleKey: "highlights.sessionsTitle",
    descriptionKey: "highlights.sessionsDescription",
  },
] as const;

const StoreHighlights = () => {
  const { t } = useTranslation("common");
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
          <H2 id="store-highlights-title" text={t("highlights.heading")} />
          <div className="store-highlights__controls">
            <IconButton
              icon={<FiArrowLeft />}
              label={t("highlights.previous")}
              onClick={() => scroll(-1)}
              size="small"
            />
            <IconButton icon={<FiArrowRight />} label={t("highlights.next")} onClick={() => scroll(1)} size="small" />
          </div>
        </div>

        <div aria-label={t("highlights.list")} className="store-highlights__list" ref={listRef} role="list">
          {highlights.map(({ titleKey, descriptionKey }) => (
            <article className="store-highlights__card" key={titleKey} role="listitem">
              <IoCheckmarkCircle aria-hidden="true" className="store-highlights__check" />
              <h3>{t(titleKey)}</h3>
              <p>{t(descriptionKey)}</p>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};

export default StoreHighlights;
