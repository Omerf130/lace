import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.scss";

export const metadata = {
  title: "Menu",
};

export default function MenuPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.grid}>
          <Link href="/models/women" className={styles.category}>
            <span className={styles.label}>Women</span>
          </Link>
          <Link href="/models/men" className={styles.category}>
            <span className={styles.label}>Men</span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
