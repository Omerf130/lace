import Image from "next/image";
import Link from "next/link";
import styles from "./CategoryEditorialSection.module.scss";

type CategoryEditorialSectionProps = {
  variant: "women" | "men";
  href: string;
  letter: "W" | "M";
  title: string;
  indexLabel: string;
  verticalLabel: string;
  imageUrl: string | null;
  priority?: boolean;
};

export default function CategoryEditorialSection({
  variant,
  href,
  letter,
  title,
  indexLabel,
  verticalLabel,
  imageUrl,
  priority = false,
}: CategoryEditorialSectionProps) {
  const ariaLabel = `${title} models`;

  return (
    <section
      className={`${styles.section} ${variant === "women" ? styles.sectionWomen : styles.sectionMen}`}
    >
      <Link href={href} className={styles.rowLink} aria-label={ariaLabel}>
        <div className={styles.sideLabel} aria-hidden="true">
          <span className={styles.sideLabelText}>{verticalLabel}</span>
        </div>

        <div className={`${styles.copy} ${styles.copyPrimary}`}>
          <span className={styles.index}>{indexLabel}</span>
          <span className={styles.title}>{title}</span>
          <span className={styles.discover}>Discover the board</span>
          <span className={styles.arrow} aria-hidden="true">
            <span className={styles.arrowLine} />
            <span className={styles.arrowHead} />
          </span>
        </div>

        <div className={styles.figure}>
          <span
            className={`${styles.title} ${styles.titleOverlay} ${
              variant === "women" ? styles.titleOverlayWomen : styles.titleOverlayMen
            }`}
            aria-hidden="true"
          >
            {title}
          </span>
          <div className={styles.imageFrame}>
            <div className={styles.imageZoom}>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 72vw, 360px"
                  className={styles.image}
                  priority={priority}
                />
              ) : (
                <div className={styles.placeholder} aria-hidden="true" />
              )}
              <span className={styles.letter}>{letter}</span>
            </div>
          </div>
        </div>

        <div className={`${styles.copy} ${styles.copyMobile}`}>
          <span className={styles.index}>{indexLabel}</span>
          <span className={styles.discover}>Discover the board</span>
          <span className={styles.arrow} aria-hidden="true">
            <span className={styles.arrowLine} />
            <span className={styles.arrowHead} />
          </span>
        </div>
      </Link>
    </section>
  );
}