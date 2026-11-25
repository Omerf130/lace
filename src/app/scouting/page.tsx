import PublicPageFrame from "@/components/PublicPageFrame/PublicPageFrame";
import ScoutingForm from "./ScoutingForm";
import styles from "./page.module.scss";

export const metadata = {
  title: "Get Scouted",
};

export default function ScoutingPage() {
  return (
    <PublicPageFrame>
      <main className={styles.main}>
        <div className={styles.inner}>
          <h1 className={styles.title}>Get Scouted</h1>
          <ScoutingForm />
        </div>
      </main>
    </PublicPageFrame>
  );
}
