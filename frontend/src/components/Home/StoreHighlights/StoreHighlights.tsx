import { useLayoutEffect, useRef } from "react";
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

const carouselCopies = [0, 1, 2] as const;

const getCarouselMetrics = (list: HTMLDivElement) => {
  const firstCopy = list.children[0] as HTMLElement | undefined;
  const secondCard = list.children[1] as HTMLElement | undefined;
  const originalCopy = list.children[highlights.length] as HTMLElement | undefined;

  if (!firstCopy || !secondCard || !originalCopy) return null;

  const loopWidth = originalCopy.offsetLeft - firstCopy.offsetLeft;
  const cardStep = secondCard.offsetLeft - firstCopy.offsetLeft;
  const firstStart = firstCopy.offsetLeft - list.offsetLeft;

  if (loopWidth <= 0) return null;

  return {
    cardStep,
    firstStart,
    loopWidth,
    originalStart: firstStart + loopWidth,
  };
};

const normalizeCarouselPosition = (list: HTMLDivElement) => {
  const metrics = getCarouselMetrics(list);
  if (!metrics) return null;

  const boundaryTolerance = Math.max(4, metrics.cardStep * 0.02);

  if (list.scrollLeft <= metrics.firstStart + boundaryTolerance) {
    list.scrollLeft += metrics.loopWidth;
  } else if (list.scrollLeft >= metrics.originalStart + metrics.loopWidth - boundaryTolerance) {
    list.scrollLeft -= metrics.loopWidth;
  }

  return metrics;
};

const StoreHighlights = () => {
  const { t } = useTranslation("common");
  const listRef = useRef<HTMLDivElement>(null);
  const scrollEndTimerRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (list) {
      const metrics = getCarouselMetrics(list);
      if (metrics) list.scrollLeft = metrics.originalStart;
    }

    return () => {
      if (scrollEndTimerRef.current !== null) window.clearTimeout(scrollEndTimerRef.current);
    };
  }, []);

  const handleLoop = () => {
    if (scrollEndTimerRef.current !== null) window.clearTimeout(scrollEndTimerRef.current);

    scrollEndTimerRef.current = window.setTimeout(() => {
      const list = listRef.current;
      if (list) normalizeCarouselPosition(list);
      scrollEndTimerRef.current = null;
    }, 100);
  };

  const scroll = (direction: -1 | 1) => {
    const list = listRef.current;
    if (!list) return;

    const distance = normalizeCarouselPosition(list)?.cardStep || 360;
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

        <div
          aria-label={t("highlights.list")}
          className="store-highlights__list"
          onScroll={handleLoop}
          ref={listRef}
          role="list"
        >
          {carouselCopies.flatMap((copy) =>
            highlights.map(({ titleKey, descriptionKey }) => (
              <article
                aria-hidden={copy !== 1}
                className="store-highlights__card"
                key={`${copy}-${titleKey}`}
                role="listitem"
              >
                <IoCheckmarkCircle aria-hidden="true" className="store-highlights__check" />
                <h3>{t(titleKey)}</h3>
                <p>{t(descriptionKey)}</p>
              </article>
            ))
          )}
        </div>
      </PageContainer>
    </section>
  );
};

export default StoreHighlights;
