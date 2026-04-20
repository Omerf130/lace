import Image from "next/image";
import { connectToDatabase } from "@/lib/mongodb";
import { Influencer } from "@/models/Influencer";
import Navbar from "@/components/Navbar/Navbar";
import type { IInfluencer } from "@/types";
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
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>Influencers</h1>

        {influencers.length === 0 ? (
          <p className={styles.empty}>No influencers yet.</p>
        ) : (
          <div className={styles.grid}>
            {influencers.map((inf) => {
              const id = inf._id.toString();
              const fullName = `${inf.firstName} ${inf.lastName}`;

              return (
                <div key={id} className={styles.card}>
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
                  <div className={styles.info}>
                    <h2 className={styles.name}>{fullName}</h2>
                    <div className={styles.socials}>
                      {inf.tiktokUrl && (
                        <a
                          href={inf.tiktokUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.socialLink}
                        >
                          {inf.tiktokFollowers ? `${inf.tiktokFollowers}K ` : ""}TikTok
                        </a>
                      )}
                      {inf.instagramUrl && (
                        <a
                          href={inf.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.socialLink}
                        >
                          {inf.instagramFollowers ? `${inf.instagramFollowers}K ` : ""}Instagram
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
