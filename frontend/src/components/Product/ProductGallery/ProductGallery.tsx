import { useEffect, useState } from "react";
import { PiX } from "react-icons/pi";

import "./ProductGallery.scss";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

const FALLBACK_IMAGE = "/images/loading.gif";

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const galleryImages = images.length ? images : [FALLBACK_IMAGE];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
  }, [productName]);

  useEffect(() => {
    if (!isExpanded) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsExpanded(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isExpanded]);

  const activeImage = galleryImages[activeIndex] ?? galleryImages[0];
  const imageLabel = `${productName}, image ${activeIndex + 1} of ${galleryImages.length}`;
  const galleryClassName = `product-gallery${galleryImages.length === 1 ? " product-gallery--single" : ""}`;

  return (
    <section aria-label={`${productName} images`} className={galleryClassName}>
      {galleryImages.length > 1 && (
        <div className="product-gallery__thumbnails">
          {galleryImages.map((image, index) => (
            <button
              aria-label={`View ${productName} image ${index + 1}`}
              aria-pressed={activeIndex === index}
              className="product-gallery__thumbnail"
              key={`${image}-${index}`}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <img alt="" src={image} />
            </button>
          ))}
        </div>
      )}

      <button
        aria-label={`Expand ${imageLabel}`}
        className="product-gallery__main"
        onClick={() => setIsExpanded(true)}
        type="button"
      >
        <img
          alt={imageLabel}
          onError={(event) => {
            event.currentTarget.src = FALLBACK_IMAGE;
          }}
          src={activeImage}
        />
      </button>

      {isExpanded && (
        <div
          aria-label={`${productName} enlarged image`}
          aria-modal="true"
          className="product-gallery__dialog"
          onClick={(event) => {
            if (event.currentTarget === event.target) setIsExpanded(false);
          }}
          role="dialog"
        >
          <div className="product-gallery__dialog-content">
            <button
              aria-label="Close enlarged image"
              className="product-gallery__close"
              onClick={() => setIsExpanded(false)}
              type="button"
            >
              <PiX aria-hidden="true" />
            </button>
            <img alt={imageLabel} src={activeImage} />
          </div>
        </div>
      )}
    </section>
  );
}
