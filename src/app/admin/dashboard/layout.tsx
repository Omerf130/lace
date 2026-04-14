"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./layout.module.scss";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.logo}>
          LACE
        </Link>

        <nav className={styles.nav}>
          <Link
            href="/admin/dashboard"
            className={`${styles.navLink} ${isActive("/admin/dashboard") ? styles.active : ""}`}
          >
            Models
          </Link>
          <Link
            href="/admin/dashboard/new"
            className={`${styles.navLink} ${isActive("/admin/dashboard/new") ? styles.active : ""}`}
          >
            + New Model
          </Link>
          <Link
            href="/admin/dashboard/settings"
            className={`${styles.navLink} ${isActive("/admin/dashboard/settings") ? styles.active : ""}`}
          >
            Settings
          </Link>
        </nav>

        <button onClick={handleLogout} className={styles.logout}>
          Sign Out
        </button>
      </aside>

      <main className={styles.content}>{children}</main>
    </div>
  );
}
