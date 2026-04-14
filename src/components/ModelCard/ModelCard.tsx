"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SerializedModel } from "@/types";
import styles from "./ModelCard.module.scss";

interface ModelCardProps {
  model: SerializedModel;
}

export default function ModelCard({ model }: ModelCardProps) {
  const hasVideo = !!model.images.coverVideo;
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function handleMouseEnter() {
    setHovered(true);
    if (hasVideo) {
      videoRef.current?.play().catch(() => {});
    }
  }

  function handleMouseLeave() {
    setHovered(false);
    if (hasVideo && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }

  return (
    <Link
      href={`/models/${model.category}/${model.slug}`}
      className={styles.card}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.imageWrapper}>
        {model.images.main ? (
          <Image
            src={model.images.main}
            alt={`${model.firstName} ${model.lastName}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`${styles.image} ${!hasVideo && hovered ? styles.imageHover : ""}`}
          />
        ) : (
          <div className={styles.placeholder} />
        )}

        {hasVideo && (
          <video
            ref={videoRef}
            src={model.images.coverVideo}
            className={`${styles.video} ${hovered ? styles.videoVisible : ""}`}
            muted
            loop
            playsInline
            preload="none"
          />
        )}
      </div>
      <p className={`${styles.name} ${hovered ? styles.nameHover : ""}`}>
        {model.firstName} {model.lastName}
      </p>
    </Link>
  );
}
