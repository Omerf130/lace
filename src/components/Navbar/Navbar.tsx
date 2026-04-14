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

      <Link href="/search" className={styles.search} aria-label="Search">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
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
          href="/about"
          className={`${styles.link} ${isActive("/about") ? styles.active : ""}`}
        >
          About
        </Link>
      </div>
    </nav>
  );
}
