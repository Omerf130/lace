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

  const cat = category as ModelCategory;

  const regularDocs = await TalentModel.find({
    category: cat,
    status: "published",
    isAiModel: { $ne: true },
  })
    .sort({ _id: 1 })
    .limit(PAGE_SIZE + 1)
    .lean<IModel[]>();

  const aiDocs = await TalentModel.find({
    category: cat,
    status: "published",
    isAiModel: true,
  })
    .sort({ _id: 1 })
    .limit(PAGE_SIZE + 1)
    .lean<IModel[]>();

  function slicePage(docs: IModel[]) {
    const hasMore = docs.length > PAGE_SIZE;
    const raw = hasMore ? docs.slice(0, PAGE_SIZE) : docs;
    const items = serializeModels(raw);
    const nextCursor = hasMore ? items[items.length - 1]._id : null;
    return { items, nextCursor };
  }

  const regular = slicePage(regularDocs);
  const ai = slicePage(aiDocs);

  const label = category === "women" ? "Women" : "Men";

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>{label}</h1>
        <ModelGrid
          initialModels={regular.items}
          initialCursor={regular.nextCursor}
          category={cat}
          isAiModel={false}
        />
        {ai.items.length > 0 && (
          <>
            <h2 className={styles.subtitle}>AI models</h2>
            <ModelGrid
              initialModels={ai.items}
              initialCursor={ai.nextCursor}
              category={cat}
              isAiModel={true}
            />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
