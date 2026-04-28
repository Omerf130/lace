import { connectToDatabase } from "@/lib/mongodb";
import { serializeModels } from "@/lib/serialize";
import { TalentModel } from "@/models/Model";
import Navbar from "@/components/Navbar/Navbar";
import ModelGrid from "@/components/ModelGrid/ModelGrid";
import type { IModel } from "@/types";
import styles from "./page.module.scss";

const PAGE_SIZE = 12;

export const metadata = { title: "AI Models" };

export default async function AiModelsPage() {
  await connectToDatabase();

  const docs = await TalentModel.find({
    status: "published",
    isAiModel: true,
  })
    .sort({ _id: 1 })
    .limit(PAGE_SIZE + 1)
    .lean<IModel[]>();

  const hasMore = docs.length > PAGE_SIZE;
  const raw = hasMore ? docs.slice(0, PAGE_SIZE) : docs;
  const items = serializeModels(raw);
  const nextCursor = hasMore ? items[items.length - 1]._id : null;

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>AI Models</h1>
        <ModelGrid
          initialModels={items}
          initialCursor={nextCursor}
          isAiModel={true}
        />
      </main>
    </>
  );
}
