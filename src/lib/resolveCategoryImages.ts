import { connectToDatabase } from "@/lib/mongodb";
import { TalentModel } from "@/models/Model";
import { SiteSettings } from "@/models/SiteSettings";

export type CategoryImageSource = "custom" | "model" | "placeholder";

export type ResolvedCategoryImage = {
  url: string | null;
  source: CategoryImageSource;
};

async function firstModelMainImage(category: "women" | "men"): Promise<string | null> {
  const doc = await TalentModel.findOne({
    category,
    status: "published",
    "images.main": { $exists: true, $nin: ["", null] },
  })
    .sort({ sortOrder: 1, _id: 1 })
    .select("images.main")
    .lean();

  const main = doc?.images?.main;
  return typeof main === "string" && main.trim() ? main.trim() : null;
}

export function resolveOneCategoryImage(
  customUrl: string | undefined | null,
  modelFallback: string | null
): ResolvedCategoryImage {
  const custom = customUrl?.trim();
  if (custom) {
    return { url: custom, source: "custom" };
  }
  if (modelFallback) {
    return { url: modelFallback, source: "model" };
  }
  return { url: null, source: "placeholder" };
}

export async function resolveCategoryImages(): Promise<{
  women: ResolvedCategoryImage;
  men: ResolvedCategoryImage;
}> {
  await connectToDatabase();

  const settings = await SiteSettings.findOne().lean();
  const womenCustom = settings?.categoryWomenImageUrl;
  const menCustom = settings?.categoryMenImageUrl;

  const [womenModel, menModel] = await Promise.all([
    womenCustom?.trim()
      ? Promise.resolve(null)
      : firstModelMainImage("women"),
    menCustom?.trim()
      ? Promise.resolve(null)
      : firstModelMainImage("men"),
  ]);

  return {
    women: resolveOneCategoryImage(womenCustom, womenModel),
    men: resolveOneCategoryImage(menCustom, menModel),
  };
}