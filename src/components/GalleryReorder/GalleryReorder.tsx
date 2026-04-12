"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./GalleryReorder.module.scss";

interface GalleryReorderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function GalleryReorder({
  images,
  onChange,
}: GalleryReorderProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const updated = [...images];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);
    setDragIndex(index);
    onChange(updated);
  }

  function handleDragEnd() {
    setDragIndex(null);
  }

  function handleRemove(index: number) {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  }

  if (images.length === 0) return null;

  return (
    <div className={styles.grid}>
      {images.map((url, index) => (
        <div
          key={url}
          className={`${styles.item} ${dragIndex === index ? styles.dragging : ""}`}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
        >
          <Image
            src={url}
            alt={`Gallery ${index + 1}`}
            width={100}
            height={133}
            className={styles.thumb}
          />
          <span className={styles.index}>{index + 1}</span>
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className={styles.removeBtn}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
