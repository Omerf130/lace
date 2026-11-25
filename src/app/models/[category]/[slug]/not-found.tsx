import Link from "next/link";
import PublicPageFrame from "@/components/PublicPageFrame/PublicPageFrame";
import styles from "./not-found.module.scss";

export default function ModelNotFound() {
  return (
    <PublicPageFrame>
      <main className={styles.main}>
        <h1 className={styles.title}>Model not found</h1>
        <p className={styles.message}>
          This model doesn&apos;t exist or has been removed.
        </p>
        <Link href="/categories" className={styles.link}>
          Browse models
        </Link>
      </main>
    </PublicPageFrame>
  );
}