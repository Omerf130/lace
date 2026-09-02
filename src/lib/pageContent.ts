import { connectToDatabase } from "@/lib/mongodb";
import { PageContent } from "@/models/PageContent";

/**
 * Fetch page content directly from MongoDB (for use in Server Components).
 * Returns `null` if no document exists for the given page.
 */
export async function getPageContent<T = Record<string, unknown>>(
  page: string
): Promise<T | null> {
  await connectToDatabase();
  const doc = await PageContent.findOne({ page }).lean();
  if (!doc) return null;
  return doc.content as T;
}
