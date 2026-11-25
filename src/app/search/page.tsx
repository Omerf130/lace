import PublicPageFrame from "@/components/PublicPageFrame/PublicPageFrame";
import SearchInput from "@/components/SearchInput/SearchInput";
import styles from "./page.module.scss";

export const metadata = {
  title: "Search",
};

export default function SearchPage() {
  return (
    <PublicPageFrame>
      <main className={styles.main}>
        <SearchInput />
      </main>
    </PublicPageFrame>
  );
}
