import { notFound } from "next/navigation";
import Image from "next/image";
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

  return {
    title: `${model.firstName} ${model.lastName}`,
    description: model.bio || `${model.firstName} ${model.lastName} at LACE Models`,
    openGraph: {
      title: `${model.firstName} ${model.lastName}`,
      description: model.bio || `${model.firstName} ${model.lastName} at LACE Models`,
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
        <div className={styles.layout}>
          <div className={styles.media}>
            {model.images.main && (
              <div className={styles.mainImage}>
                <Image
                  src={model.images.main}
                  alt={fullName}
                  fill
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className={styles.image}
                  priority
                />
              </div>
            )}

            {model.images.gallery.length > 0 && (
              <GallerySlider images={model.images.gallery} alt={fullName} />
            )}

            {model.images.pdf && (
              <a
                href={model.images.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.pdfLink}
              >
                PDF
              </a>
            )}
          </div>

          <aside className={styles.info}>
            <h1 className={styles.name}>{fullName}</h1>

            {model.bio && <p className={styles.bio}>{model.bio}</p>}

            <div className={styles.attributes}>
              {attrs.height > 0 && <Attr label="Height" value={`${attrs.height} cm`} />}
              {attrs.bust > 0 && <Attr label="Bust" value={`${attrs.bust} cm`} />}
              {attrs.waist > 0 && <Attr label="Waist" value={`${attrs.waist} cm`} />}
              {attrs.hips > 0 && <Attr label="Hips" value={`${attrs.hips} cm`} />}
              {attrs.shoes > 0 && <Attr label="Shoes" value={`${attrs.shoes}`} />}
              {attrs.hair && <Attr label="Hair" value={attrs.hair} />}
              {attrs.eyes && <Attr label="Eyes" value={attrs.eyes} />}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Attr({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.attr}>
      <span className={styles.attrLabel}>{label}</span>
      <span className={styles.attrValue}>{value}</span>
    </div>
  );
}
