import Link from "next/link";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <main className={styles.main}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>Page not found</p>
      <Link href="/" className={styles.link}>
        Back to home
      </Link>
    </main>
  );
}
