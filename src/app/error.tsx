"use client";

import styles from "./error.module.scss";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Something went wrong</h1>
      <p className={styles.message}>{error.message || "An unexpected error occurred."}</p>
      <button onClick={reset} className={styles.button}>
        Try again
      </button>
    </main>
  );
}
