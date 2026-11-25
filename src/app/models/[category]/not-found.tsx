import Link from "next/link";
import PublicPageFrame from "@/components/PublicPageFrame/PublicPageFrame";
import styles from "./not-found.module.scss";

export default function CategoryNotFound() {
  return (
    <PublicPageFrame>
      <main className={styles.main}>
        <h1 className={styles.title}>Category not found</h1>
        <p className={styles.message}>
          We only have &quot;women&quot; and &quot;men&quot; categories.
        </p>
        <Link href="/categories" className={styles.link}>
          Choose category
        </Link>
      </main>
    </PublicPageFrame>
  );
}