import PublicPageFrame from "@/components/PublicPageFrame/PublicPageFrame";
import CategoryEditorialSection from "./CategoryEditorialSection";
import { resolveCategoryImages } from "@/lib/resolveCategoryImages";
import styles from "./page.module.scss";

export const revalidate = 60;

export const metadata = {
  title: "Categories",
};

export default async function CategoriesPage() {
  const { women, men } = await resolveCategoryImages();

  return (
    <PublicPageFrame>
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.masthead}>
            <p className={styles.mastheadBrand}>LACE Model Management</p>
            <div className={styles.mastheadRow}>
              <span className={styles.mastheadSide}>The Talent</span>
              <span className={styles.mastheadSide}>Model Directory</span>
            </div>
            <hr className={styles.mastheadRule} />
          </header>

          <div className={styles.editorial}>
            <CategoryEditorialSection
              variant="women"
              href="/models/women"
              letter="W"
              title="Women"
              indexLabel="01 — WOMEN"
              verticalLabel="LACE / WOMEN"
              imageUrl={women.url}
              priority
            />

            <hr className={styles.sectionRule} aria-hidden="true" />

            <CategoryEditorialSection
              variant="men"
              href="/models/men"
              letter="M"
              title="Men"
              indexLabel="02 — MEN"
              verticalLabel="LACE / MEN"
              imageUrl={men.url}
            />
          </div>
        </div>
      </main>
    </PublicPageFrame>
  );
}