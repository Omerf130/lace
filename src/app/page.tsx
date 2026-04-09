import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>lace-models</h1>
      <p className={styles.subtitle}>
        Next.js · TypeScript · Module SCSS · MongoDB Atlas
      </p>
    </main>
  );
}
