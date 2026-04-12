"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <nav className={styles.navbar}>
      <Link href="/menu" className={styles.logo}>
        LACE
      </Link>

      <div className={styles.links}>
        <Link
          href="/models/women"
          className={`${styles.link} ${isActive("/models/women") ? styles.active : ""}`}
        >
          Women
        </Link>
        <Link
          href="/models/men"
          className={`${styles.link} ${isActive("/models/men") ? styles.active : ""}`}
        >
          Men
        </Link>
        <Link
          href="/search"
          className={`${styles.link} ${isActive("/search") ? styles.active : ""}`}
        >
          Search
        </Link>
        <Link
          href="/about"
          className={`${styles.link} ${isActive("/about") ? styles.active : ""}`}
        >
          About
        </Link>
      </div>
    </nav>
  );
}
