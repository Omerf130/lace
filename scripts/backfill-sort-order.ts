/**
 * One-time backfill: assign a numeric `sortOrder` to every TalentModel document
 * that is missing one, using the timestamp encoded in the `_id` (so the initial
 * order matches today's ascending-by-_id display).
 *
 * Usage:
 *   npx tsx scripts/backfill-sort-order.ts
 *   # or
 *   npm run backfill-sort-order
 *
 * Requires MONGODB_URI in .env.local
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import { TalentModel } from "../src/models/Model";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected to MongoDB");

  const db = mongoose.connection.db!;
  const coll = db.collection(TalentModel.collection.name);

  const cursor = coll.find({
    $or: [{ sortOrder: { $exists: false } }, { sortOrder: null }],
  });

  let updated = 0;
  for await (const doc of cursor) {
    const id = doc._id;
    if (!id || typeof id.getTimestamp !== "function") {
      console.warn(`Skip ${id}: cannot derive timestamp from _id`);
      continue;
    }
    const sortOrder = id.getTimestamp().getTime();
    const res = await coll.updateOne(
      { _id: id },
      { $set: { sortOrder } }
    );
    if (res.modifiedCount) {
      updated += 1;
      console.log(`talent_model ${id} -> sortOrder: ${sortOrder}`);
    }
  }

  console.log(`Done. Updated talent models: ${updated}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
