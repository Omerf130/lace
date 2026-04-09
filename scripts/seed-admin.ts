/**
 * Seed script — creates the initial admin user.
 *
 * Usage:
 *   npx tsx scripts/seed-admin.ts
 *
 * Requires MONGODB_URI in .env.local
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

const EMAIL = "admin@lace.com";
const PASSWORD = "admin123";

async function seed() {
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected to MongoDB");

  const db = mongoose.connection.db!;
  const users = db.collection("users");

  const existing = await users.findOne({ email: EMAIL });
  if (existing) {
    console.log(`Admin user already exists: ${EMAIL}`);
    await mongoose.disconnect();
    return;
  }

  const hashed = await bcrypt.hash(PASSWORD, 12);
  await users.insertOne({
    email: EMAIL,
    password: hashed,
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log(`Admin user created: ${EMAIL} / ${PASSWORD}`);
  console.log("Change the password after first login!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
