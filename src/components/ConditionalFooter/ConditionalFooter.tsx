"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import Footer from "@/components/Footer/Footer";

export default function ConditionalFooter() {
  const segments = useSelectedLayoutSegments();

  if (segments.length === 0) return null;
  if (segments[0] === "menu" || segments[0] === "admin") return null;

  return <Footer />;
}
