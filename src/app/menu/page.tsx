import Link from "next/link";
import { NAV_ITEMS } from "@/lib/navLinks";
import styles from "./page.module.scss";

export const metadata = {
  title: "Menu",
};

export default function MenuPage() {
  return (
    <main className={styles.page}>
      <Link href="/" className={styles.logo}>
        LACE
      </Link>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className={styles.navLink}>
            {item.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
