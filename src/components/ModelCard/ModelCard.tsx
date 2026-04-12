import Image from "next/image";
import Link from "next/link";
import type { IModel } from "@/types";
import styles from "./ModelCard.module.scss";

interface ModelCardProps {
  model: IModel;
}

export default function ModelCard({ model }: ModelCardProps) {
  return (
    <Link
      href={`/models/${model.category}/${model.slug}`}
      className={styles.card}
    >
      <div className={styles.imageWrapper}>
        {model.images.main ? (
          <Image
            src={model.images.main}
            alt={`${model.firstName} ${model.lastName}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder} />
        )}
      </div>
      <p className={styles.name}>
        {model.firstName} {model.lastName}
      </p>
    </Link>
  );
}
