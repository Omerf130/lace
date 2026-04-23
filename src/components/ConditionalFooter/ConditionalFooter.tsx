"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer/Footer";

export default function ConditionalFooter() {
  const hookPathname = usePathname();
  // On the client, use the real URL so layout-level footer state matches <Link> navigations.
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : hookPathname;
  if (
    pathname === "/" ||
    pathname === "/menu" ||
    pathname.startsWith("/menu/") ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }
  return <Footer />;
}
