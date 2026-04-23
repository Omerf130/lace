"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import {
  normalizePathname,
  subscribeToBrowserPathname,
} from "@/lib/browserPathname";

export default function ConditionalFooter() {
  const serverPath = usePathname();
  const rawPath = useSyncExternalStore(
    subscribeToBrowserPathname,
    () => window.location.pathname,
    () => serverPath
  );
  const pathname = normalizePathname(rawPath);

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
