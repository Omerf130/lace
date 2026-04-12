import Navbar from "@/components/Navbar/Navbar";
import styles from "./loading.module.scss";

export default function ModelLoading() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.layout}>
          <div className={styles.imageSkeleton} />
          <aside className={styles.info}>
            <div className={styles.nameSkeleton} />
            <div className={styles.bioSkeleton} />
            <div className={styles.bioSkeleton} />
            <div className={styles.attrs}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={styles.attrSkeleton} />
              ))}
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
