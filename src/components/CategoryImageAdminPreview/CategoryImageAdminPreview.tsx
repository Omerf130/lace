import Image from "next/image";
import styles from "./CategoryImageAdminPreview.module.scss";

type CategoryImageAdminPreviewProps = {
  letter: "W" | "M";
  imageUrl: string | null;
  sourceLabel: string;
};

export default function CategoryImageAdminPreview({
  letter,
  imageUrl,
  sourceLabel,
}: CategoryImageAdminPreviewProps) {
  return (
    <div className={styles.wrap}>
      <p className={styles.source}>{sourceLabel}</p>
      <div className={styles.card}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="200px"
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder} aria-hidden="true" />
        )}
        <span className={styles.letter}>{letter}</span>
      </div>
    </div>
  );
}