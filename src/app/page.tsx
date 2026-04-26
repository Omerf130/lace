import Link from "next/link";
import Image from "next/image";
import heroLogo from "@/images/IMG_2808.svg";
import { connectToDatabase } from "@/lib/mongodb";
import { SiteSettings } from "@/models/SiteSettings";
import styles from "./page.module.scss";

export const revalidate = 60;

export default async function HomePage() {
  await connectToDatabase();
  const settings = await SiteSettings.findOne().lean();

  const coverType = settings?.coverType;
  const coverVideoUrl = settings?.coverVideoUrl;
  const coverImageUrl = settings?.coverImageUrl;

  const homeLogoText = settings?.homeLogoText?.trim() ?? "";

  return (
    <main className={styles.hero}>
      {coverType === "video" && coverVideoUrl && (
        <video
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={coverVideoUrl} type="video/mp4" />
        </video>
      )}

      {coverType === "image" && coverImageUrl && (
        <Image
          src={coverImageUrl}
          alt="LACE"
          fill
          priority
          className={styles.coverImage}
        />
      )}

      <div className={styles.overlay} />

      <Link href="/menu" className={styles.content}>
        {homeLogoText ? (
          <h1 className={styles.title}>{homeLogoText}</h1>
        ) : (
          <span className={styles.logoImageWrap}>
            <Image
              src={heroLogo}
              alt="LACE"
              fill
              priority
              sizes="(max-width: 768px) 98vw, 1200px"
              className={styles.logoImage}
            />
          </span>
        )}
      </Link>
    </main>
  );
}
