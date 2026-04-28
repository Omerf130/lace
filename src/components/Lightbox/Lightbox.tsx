"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import styles from "./Lightbox.module.scss";

interface LightboxProps {
  images: string[];
  index: number;
  alt: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({
  images,
  index,
  alt,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const hasMultiple = images.length > 1;

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && hasMultiple) {
        onPrev();
      } else if (e.key === "ArrowRight" && hasMultiple) {
        onNext();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext, hasMultiple]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  if (typeof document === "undefined") return null;

  const src = images[index];

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return createPortal(
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={handleBackdropClick}
    >
      <button
        ref={closeBtnRef}
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label="Close image viewer"
      >
        <span aria-hidden="true">×</span>
      </button>

      {hasMultiple && (
        <button
          type="button"
          className={`${styles.nav} ${styles.prev}`}
          onClick={onPrev}
          aria-label="Previous image"
        >
          <span aria-hidden="true">‹</span>
        </button>
      )}

      <div className={styles.imageWrapper}>
        <Image
          key={src}
          src={src}
          alt={`${alt} — ${index + 1} of ${images.length}`}
          fill
          sizes="90vw"
          className={styles.image}
          priority
        />
      </div>

      {hasMultiple && (
        <button
          type="button"
          className={`${styles.nav} ${styles.next}`}
          onClick={onNext}
          aria-label="Next image"
        >
          <span aria-hidden="true">›</span>
        </button>
      )}
    </div>,
    document.body
  );
}
