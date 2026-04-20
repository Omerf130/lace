"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navLinks";
import styles from "./Footer.module.scss";

export default function Footer() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Link href="/menu" className={styles.brand}>
          LACE
        </Link>

        <nav className={styles.nav} aria-label="Site">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${isActive(item.href) ? styles.active : ""}`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/search"
            className={`${styles.link} ${isActive("/search") ? styles.active : ""}`}
          >
            Search
          </Link>
        </nav>
      </div>

      <p className={styles.copy}>
        &copy; {new Date().getFullYear()} LACE Models. All rights reserved.
      </p>
    </footer>
  );
}
