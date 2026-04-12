import Navbar from "@/components/Navbar/Navbar";
import styles from "./loading.module.scss";

export default function CategoryLoading() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.titleSkeleton} />
        <div className={styles.grid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.imageSkeleton} />
              <div className={styles.nameSkeleton} />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
