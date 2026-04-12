import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import styles from "./not-found.module.scss";

export default function ModelNotFound() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>Model not found</h1>
        <p className={styles.message}>
          This model doesn&apos;t exist or has been removed.
        </p>
        <Link href="/menu" className={styles.link}>
          Browse models
        </Link>
      </main>
    </>
  );
}
