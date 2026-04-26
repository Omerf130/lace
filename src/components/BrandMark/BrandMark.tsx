"use client";

import Image from "next/image";
import brandSrc from "@/images/logo1.png";
import menuBrandSrc from "@/images/logo2.png";
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
    variant === "menu"
      ? "(max-width: 768px) min(92vw, 480px), 720px"
      : variant === "navbar"
        ? "(max-width: 768px) min(92vw, 560px), 840px"
        : "(max-width: 768px) 280px, 440px";

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
