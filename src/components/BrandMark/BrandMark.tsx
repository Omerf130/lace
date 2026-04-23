"use client";

import Image from "next/image";
import brandSrc from "@/images/WhatsApp_Image_2026-04-20_at_15.39.05__1_-removebg-preview.png";
import menuBrandSrc from "@/images/WhatsApp_Image_2026-04-20_at_15.39.05-removebg-preview (1).png";
import styles from "./BrandMark.module.scss";

export type BrandMarkVariant =
  | "navbar"
  | "footer"
  | "menu"
  | "admin"
  | "adminLogin";

const variantClass: Record<BrandMarkVariant, string> = {
  navbar: styles.navbar,
  footer: styles.footer,
  menu: styles.menu,
  admin: styles.admin,
  adminLogin: styles.adminLogin,
};

export default function BrandMark({ variant }: { variant: BrandMarkVariant }) {
  const src = variant === "menu" ? menuBrandSrc : brandSrc;
  const sizes =
    variant === "menu" || variant === "navbar"
      ? "(max-width: 768px) min(92vw, 420px), 640px"
      : "(max-width: 768px) 180px, 280px";

  return (
    <Image
      src={src}
      alt="LACE"
      className={`${styles.img} ${variantClass[variant]}`}
      sizes={sizes}
      priority={variant === "navbar" || variant === "menu"}
    />
  );
}
