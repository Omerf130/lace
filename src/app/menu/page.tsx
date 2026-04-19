import Link from "next/link";
import styles from "./page.module.scss";

export const metadata = {
  title: "Menu",
};

const NAV_ITEMS = [
  { label: "Women", href: "/models/women" },
  { label: "Men", href: "/models/men" },
  { label: "Influencers", href: "/influencers" },
  { label: "Get Scouted", href: "/scouting" },
  { label: "About", href: "/about" },
];

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
