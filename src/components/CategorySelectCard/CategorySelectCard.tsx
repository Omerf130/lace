import Image from "next/image";
import Link from "next/link";
import styles from "./CategorySelectCard.module.scss";

type CategorySelectCardProps = {
  href: string;
  letter: "W" | "M";
  label: string;
  imageUrl: string | null;
};

export default function CategorySelectCard({
  href,
  letter,
  label,
  imageUrl,
}: CategorySelectCardProps) {
  return (
    <Link href={href} className={styles.card} aria-label={label}>
      <span className={styles.srOnly}>{label}</span>
      <div className={styles.imageWrap}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 88vw, 320px"
            className={styles.image}
            priority={letter === "W"}
          />
        ) : (
          <div className={styles.placeholder} aria-hidden="true" />
        )}
        <span className={styles.letter}>{letter}</span>
      </div>
    </Link>
  );
}