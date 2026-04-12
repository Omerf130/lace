import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.scss";

export const metadata = {
  title: "About — LACE",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>About</h1>

          <p className={styles.text}>
            LACE is a boutique models agency representing a curated roster of
            talent across the globe. We believe in authenticity, individuality,
            and the power of a strong visual identity.
          </p>

          <p className={styles.text}>
            Founded with the vision of bridging the gap between high fashion and
            commercial markets, LACE works with both established and emerging
            faces to create lasting partnerships with the world&apos;s leading
            brands, publications, and creative directors.
          </p>

          <div className={styles.contact}>
            <h2 className={styles.subtitle}>Contact</h2>
            <p className={styles.text}>
              info@lacemodels.com
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
