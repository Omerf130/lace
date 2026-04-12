import Link from "next/link";
import styles from "./page.module.scss";

export default function HomePage() {
  return (
    <main className={styles.hero}>
      <video
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/homepage-video.mp4" type="video/mp4" />
      </video>

      <div className={styles.overlay} />

      <Link href="/menu" className={styles.content}>
        <h1 className={styles.title}>LACE</h1>
      </Link>
    </main>
  );
}
