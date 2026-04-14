import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.scss";

export const metadata = {
  title: "About",
  description:
    "LACE — an international boutique agency founded in 2018, representing the most unique and high-end talents.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.content}>
          <p className={styles.intro}>
            We are an international boutique agency founded in 2018, embodying an
            exclusive collection of models. The agency represents the most unique
            and high-end talents this industry has to offer.
          </p>

          <section className={styles.section}>
            <h2 className={styles.name}>Lauren Avichen — CEO</h2>
            <p className={styles.detail}>
              <a href="mailto:lauren@lacemodel.com">lauren@lacemodel.com</a>
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>The Team</h2>
          </section>

          <section className={styles.section}>
            <h3 className={styles.name}>Shir — Booker Junior</h3>
            <p className={styles.detail}>
              <a href="mailto:shir@lacemodel.com">shir@lacemodel.com</a>
            </p>
            <p className={styles.detail}>M: +972 54-615-6776</p>
            <p className={styles.detail}>B: +972 54-600-4652</p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.name}>Michal Kadush — Model Agent</h3>
            <p className={styles.detail}>
              <a href="mailto:michal@lacemodel.com">michal@lacemodel.com</a>
            </p>
            <p className={styles.detail}>B: +972 52-471-5515</p>
            <p className={styles.detail}>M: +972 58-668-6187</p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.name}>Talia Nehama — Head of Influencers</h3>
            <p className={styles.detail}>
              <a href="mailto:digital@lacemodel.com">digital@lacemodel.com</a>
            </p>
            <p className={styles.detail}>Tel: +972 54-549-9344</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Scouting</h2>
            <p className={styles.detail}>
              <a href="mailto:scouting@lacemodel.com">scouting@lacemodel.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
