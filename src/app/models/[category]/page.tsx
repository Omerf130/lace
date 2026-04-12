import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { serializeModels } from "@/lib/serialize";
import { TalentModel } from "@/models/Model";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ModelGrid from "@/components/ModelGrid/ModelGrid";
import type { IModel, ModelCategory } from "@/types";
import styles from "./page.module.scss";

const VALID_CATEGORIES: ModelCategory[] = ["men", "women"];
const PAGE_SIZE = 12;

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const label = category === "women" ? "Women" : "Men";
  return { title: label };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category as ModelCategory)) {
    notFound();
  }

  await connectToDatabase();

  const models = await TalentModel.find({ category })
    .sort({ _id: 1 })
    .limit(PAGE_SIZE + 1)
    .lean<IModel[]>();

  const hasMore = models.length > PAGE_SIZE;
  const raw = hasMore ? models.slice(0, PAGE_SIZE) : models;
  const items = serializeModels(raw);
  const nextCursor = hasMore ? items[items.length - 1]._id : null;

  const label = category === "women" ? "Women" : "Men";

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>{label}</h1>
        <ModelGrid
          initialModels={items}
          initialCursor={nextCursor}
          category={category as ModelCategory}
        />
      </main>
      <Footer />
    </>
  );
}
