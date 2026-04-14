import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { TalentModel } from "@/models/Model";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import GallerySlider from "@/components/GallerySlider/GallerySlider";
import type { IModel, ModelCategory } from "@/types";
import styles from "./page.module.scss";

export const revalidate = 60;

const VALID_CATEGORIES: ModelCategory[] = ["men", "women"];

interface ModelPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: ModelPageProps) {
  const { category, slug } = await params;

  if (!VALID_CATEGORIES.includes(category as ModelCategory)) {
    return { title: "Not Found" };
  }

  await connectToDatabase();
  const model = await TalentModel.findOne({ slug, category, status: "published" }).lean<IModel>();

  if (!model) return { title: "Not Found" };

  const fullName = `${model.firstName} ${model.lastName}`;

  return {
    title: fullName,
    description: `${fullName} at LACE Models`,
    openGraph: {
      title: fullName,
      description: `${fullName} at LACE Models`,
      images: model.images.main ? [{ url: model.images.main }] : [],
    },
  };
}

export default async function ModelPage({ params }: ModelPageProps) {
  const { category, slug } = await params;

  if (!VALID_CATEGORIES.includes(category as ModelCategory)) {
    notFound();
  }

  await connectToDatabase();
  const model = await TalentModel.findOne({ slug, category, status: "published" }).lean<IModel>();

  if (!model) notFound();

  const fullName = `${model.firstName} ${model.lastName}`;
  const attrs = model.attributes;

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.name}>{fullName}</h1>

        {(model.images.pdf || model.instagramUrl) && (
          <div className={styles.links}>
            {model.images.pdf && (
              <a
                href={model.images.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                PDF
              </a>
            )}
            {model.instagramUrl && (
              <a
                href={model.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Instagram
              </a>
            )}
          </div>
        )}

        <div className={styles.attributes}>
          {attrs.height > 0 && <Attr label="Height" value={`${attrs.height} cm`} />}
          {attrs.bust > 0 && <Attr label="Bust" value={`${attrs.bust}`} />}
          {attrs.waist > 0 && <Attr label="Waist" value={`${attrs.waist}`} />}
          {attrs.hips > 0 && <Attr label="Hips" value={`${attrs.hips}`} />}
          {attrs.shoes > 0 && <Attr label="Shoes" value={`${attrs.shoes}`} />}
          {attrs.hair && <Attr label="Hair" value={attrs.hair} />}
          {attrs.eyes && <Attr label="Eyes" value={attrs.eyes} />}
        </div>

        {(() => {
          const allImages = [
            ...(model.images.main ? [model.images.main] : []),
            ...model.images.gallery,
          ];
          return allImages.length > 0 ? (
            <GallerySlider images={allImages} alt={fullName} />
          ) : null;
        })()}
      </main>
      <Footer />
    </>
  );
}

function Attr({ label, value }: { label: string; value: string }) {
  return (
    <span className={styles.attr}>
      <span className={styles.attrLabel}>{label}</span>{" "}
      <span className={styles.attrValue}>{value}</span>
    </span>
  );
}
