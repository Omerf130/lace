"use client";

import Image from "next/image";
import styles from "./GallerySlider.module.scss";

export type GalleryLayout = "portrait" | "horizontal";

interface GallerySliderProps {
  images: string[];
  alt: string;
  /** portrait: 3/4 tiles (default). horizontal: 16/9 landscape tiles for horizontal galleries. */
  layout?: GalleryLayout;
  /** When provided, each image is rendered as a button that calls this handler with its index in `images`. */
  onImageClick?: (index: number) => void;
}

function groupIntoRows(images: string[]): string[][] {
  const rows: string[][] = [];
  let i = 0;

  while (i < images.length) {
    const posInCycle = i % 5;

    if (posInCycle === 0) {
      rows.push([images[i]]);
      i++;
    } else {
      const remaining = images.length - i;
      if (remaining === 1) {
        rows.push([images[i]]);
        i++;
      } else {
        rows.push([images[i], images[i + 1]]);
        i += 2;
      }
    }
  }

  return rows;
}

export default function GallerySlider({
  images,
  alt,
  layout = "portrait",
  onImageClick,
}: GallerySliderProps) {
  if (images.length === 0) return null;

  const rows = groupIntoRows(images);
  let imgIndex = 0;
  const galleryClass =
    layout === "horizontal"
      ? `${styles.gallery} ${styles.galleryHorizontal}`
      : styles.gallery;

  return (
    <div className={galleryClass}>
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className={
            layout === "horizontal"
              ? `${styles.row} ${styles.rowHorizontal}`
              : styles.row
          }
        >
          {row.map((src) => {
            const idx = imgIndex++;
            const itemClass =
              layout === "horizontal"
                ? `${styles.item} ${styles.itemHorizontal}`
                : styles.item;
            const sizes =
              layout === "horizontal"
                ? "(max-width: 639px) 100vw, (max-width: 1023px) 42vw, min(420px, 38vw)"
                : "250px";
            const imgEl = (
              <Image
                src={src}
                alt={`${alt} — ${idx + 1}`}
                fill
                sizes={sizes}
                className={styles.image}
              />
            );

            if (onImageClick) {
              return (
                <button
                  key={src}
                  type="button"
                  className={`${itemClass} ${styles.itemButton}`}
                  onClick={() => onImageClick(idx)}
                  aria-label={`Open image ${idx + 1}`}
                >
                  {imgEl}
                </button>
              );
            }

            return (
              <div key={src} className={itemClass}>
                {imgEl}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
