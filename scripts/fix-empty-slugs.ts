/**
 * One-time / maintenance: set a non-empty slug on influencers (and models) where slug is missing or "".
 *
 * Usage:
 *   npx tsx scripts/fix-empty-slugs.ts
 *
 * Requires MONGODB_URI in .env.local
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import { slugFromNames } from "../src/lib/slugFromNames";
import { Influencer } from "../src/models/Influencer";
import { TalentModel } from "../src/models/Model";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

async function fixCollection(
  name: string,
  fallbackPrefix: string
): Promise<number> {
  const db = mongoose.connection.db!;
  const coll = db.collection(name);
  const cursor = coll.find({
    $or: [{ slug: "" }, { slug: { $exists: false } }],
  });

  let updated = 0;
  for await (const doc of cursor) {
    const firstName = String(doc.firstName ?? "").trim();
    const lastName = String(doc.lastName ?? "").trim();
    if (!firstName || !lastName) {
      console.warn(
        `Skip ${name} ${doc._id}: missing firstName or lastName`
      );
      continue;
    }
    const slug = slugFromNames(firstName, lastName, fallbackPrefix);
    const res = await coll.updateOne(
      { _id: doc._id },
      { $set: { slug } }
    );
    if (res.modifiedCount) {
      updated += 1;
      console.log(`${name} ${doc._id} -> slug: ${slug}`);
    }
  }
  return updated;
}

async function main() {
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected to MongoDB");

  const inf = await fixCollection(Influencer.collection.name, "influencer");
  const mod = await fixCollection(TalentModel.collection.name, "model");

  console.log(`Done. Updated influencers: ${inf}, talent models: ${mod}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
