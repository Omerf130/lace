"use client";

import { useCallback, useMemo, useState } from "react";
import GallerySlider from "@/components/GallerySlider/GallerySlider";
import Lightbox from "@/components/Lightbox/Lightbox";
import styles from "./ModelGalleries.module.scss";

interface ModelGalleriesProps {
  portraitImages: string[];
  horizontalImages: string[];
  coverVideo?: string;
  alt: string;
}

export default function ModelGalleries({
  portraitImages,
  horizontalImages,
  coverVideo,
  alt,
}: ModelGalleriesProps) {
  const combined = useMemo(
    () => [...portraitImages, ...horizontalImages],
    [portraitImages, horizontalImages]
  );

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const handleClose = useCallback(() => setOpenIdx(null), []);
  const handlePrev = useCallback(() => {
    setOpenIdx((i) =>
      i === null ? null : (i - 1 + combined.length) % combined.length
    );
  }, [combined.length]);
  const handleNext = useCallback(() => {
    setOpenIdx((i) => (i === null ? null : (i + 1) % combined.length));
  }, [combined.length]);

  const portraitOffset = portraitImages.length;

  return (
    <>
      {portraitImages.length > 0 && (
        <GallerySlider
          images={portraitImages}
          alt={alt}
          onImageClick={(i) => setOpenIdx(i)}
        />
      )}

      {horizontalImages.length > 0 && (
        <section className={styles.horizontalSection} aria-label="Landscape images">
          <GallerySlider
            images={horizontalImages}
            alt={`${alt} — landscape`}
            layout="horizontal"
            onImageClick={(i) => setOpenIdx(portraitOffset + i)}
          />
        </section>
      )}

      {coverVideo && (
        <section className={styles.videoSection} aria-label={`${alt} cover video`}>
          <div className={styles.videoWrapper}>
            <video
              src={coverVideo}
              className={styles.video}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
          </div>
        </section>
      )}

      {openIdx !== null && combined.length > 0 && (
        <Lightbox
          images={combined}
          index={openIdx}
          alt={alt}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  );
}
