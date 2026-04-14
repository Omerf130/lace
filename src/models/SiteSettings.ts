import { Schema, model, models } from "mongoose";

export interface ISiteSettings {
  coverVideoUrl?: string;
  coverImageUrl?: string;
  coverType?: "video" | "image";
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    coverVideoUrl: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" },
    coverType: { type: String, enum: ["video", "image", ""], default: "" },
  },
  { timestamps: true }
);

export const SiteSettings =
  models.SiteSettings ?? model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
