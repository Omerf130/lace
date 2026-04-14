"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./GallerySlider.module.scss";

interface GallerySliderProps {
  images: string[];
  alt: string;
}

export default function GallerySlider({ images, alt }: GallerySliderProps) {
  if (images.length === 0) return null;

  return (
    <div className={styles.slider}>
      <Swiper
        modules={[Navigation]}
        navigation
        loop={images.length > 3}
        spaceBetween={4}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 3 },
        }}
      >
        {images.map((src, i) => (
          <SwiperSlide key={src}>
            <div className={styles.slide}>
              <Image
                src={src}
                alt={`${alt} — ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className={styles.image}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
