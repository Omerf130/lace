import Image from "next/image";
import styles from "./GallerySlider.module.scss";

interface GallerySliderProps {
  images: string[];
  alt: string;
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

export default function GallerySlider({ images, alt }: GallerySliderProps) {
  if (images.length === 0) return null;

  const rows = groupIntoRows(images);
  let imgIndex = 0;

  return (
    <div className={styles.gallery}>
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className={styles.row}>
          {row.map((src) => {
            const idx = imgIndex++;
            return (
              <div key={src} className={styles.item}>
                <Image
                  src={src}
                  alt={`${alt} — ${idx + 1}`}
                  fill
                  sizes="250px"
                  className={styles.image}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
