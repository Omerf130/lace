"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./GallerySlider.module.scss";

interface GallerySliderProps {
  images: string[];
  alt: string;
}

export default function GallerySlider({ images, alt }: GallerySliderProps) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) return null;

  const prev = () =>
    setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));

  const next = () =>
    setCurrent((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className={styles.slider}>
      <div className={styles.imageWrapper}>
        <Image
          src={images[current]}
          alt={`${alt} — ${current + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className={styles.image}
          priority={current === 0}
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={prev}
            aria-label="Previous image"
          >
            &#8592;
          </button>
          <button
            className={`${styles.arrow} ${styles.arrowRight}`}
            onClick={next}
            aria-label="Next image"
          >
            &#8594;
          </button>

          <div className={styles.counter}>
            {current + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
