import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import styles from "./not-found.module.scss";

export default function CategoryNotFound() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>Category not found</h1>
        <p className={styles.message}>
          We only have &quot;women&quot; and &quot;men&quot; categories.
        </p>
        <Link href="/menu" className={styles.link}>
          Go to menu
        </Link>
      </main>
    </>
  );
}
