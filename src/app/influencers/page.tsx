import Image from "next/image";
import { connectToDatabase } from "@/lib/mongodb";
import { Influencer } from "@/models/Influencer";
import Navbar from "@/components/Navbar/Navbar";
import InfluencerSocialRow from "@/components/InfluencerSocialRow/InfluencerSocialRow";
import type { IInfluencer } from "@/types";
import influencersLogo from "@/images/WhatsApp_Image_2026-04-26_at_15.57.15__2_-removebg-preview.png";
import styles from "./page.module.scss";

export const revalidate = 60;

export const metadata = {
  title: "Influencers",
};

export default async function InfluencersPage() {
  await connectToDatabase();

  const influencers = await Influencer.find({ status: "published" })
    .sort({ _id: 1 })
    .lean<IInfluencer[]>();

  return (
    <>
      <Navbar logoSrc={influencersLogo} logoAlt="Influencers" />
      <main className={styles.main}>
        <h1 className={styles.title}>Influencers</h1>

        {influencers.length === 0 ? (
          <p className={styles.empty}>No influencers yet.</p>
        ) : (
          <div className={styles.grid}>
            {influencers.map((inf) => {
              const id = inf._id.toString();
              const fullName = `${inf.firstName} ${inf.lastName}`;
              const hebrew = inf.hebrewName?.trim();

              return (
                <article key={id} className={styles.card}>
                  <div className={styles.imageWrapper}>
                    {inf.image ? (
                      <Image
                        src={inf.image}
                        alt={fullName}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className={styles.image}
                      />
                    ) : (
                      <div className={styles.placeholder} />
                    )}
                  </div>
                  <div className={styles.body}>
                    <div className={styles.nameRow}>
                      <span className={styles.nameEn}>{fullName}</span>
                      {hebrew ? (
                        <span className={styles.nameHe} dir="rtl">
                          {hebrew}
                        </span>
                      ) : null}
                    </div>
                    <InfluencerSocialRow
                      instagramUrl={inf.instagramUrl}
                      tiktokUrl={inf.tiktokUrl}
                      youtubeUrl={inf.youtubeUrl}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
