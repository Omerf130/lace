import Navbar from "@/components/Navbar/Navbar";
import SearchInput from "@/components/SearchInput/SearchInput";
import styles from "./page.module.scss";

export const metadata = {
  title: "Search",
};

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <SearchInput />
      </main>
    </>
  );
}
