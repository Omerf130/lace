"use client";

import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navLinks";
import BrandMark from "@/components/BrandMark/BrandMark";
import styles from "./Navbar.module.scss";

type NavbarProps = {
  logoSrc?: StaticImageData;
  logoAlt?: string;
};

export default function Navbar({ logoSrc, logoAlt }: NavbarProps = {}) {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <nav className={styles.navbar}>
      <Link
        href="/menu"
        className={`${styles.logo} ${logoSrc ? styles.logoOverride : ""}`}
      >
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt={logoAlt ?? "LACE"}
            className={styles.logoImage}
            sizes="(max-width: 768px) min(60vw, 320px), 420px"
            priority
          />
        ) : (
          <BrandMark variant="navbar" />
        )}
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

      <div className={styles.linksWrapper}>
        <div className={styles.links}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${isActive(item.href) ? styles.active : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
