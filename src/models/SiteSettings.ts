import { Schema, model, models } from "mongoose";

export interface ISiteSettings {
  coverVideoUrl?: string;
  coverImageUrl?: string;
  coverType?: "video" | "image";
  homeLogoText?: string;
  homeLogoImageUrl?: string;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    coverVideoUrl: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" },
    coverType: { type: String, enum: ["video", "image", ""], default: "" },
    homeLogoText: { type: String, default: "" },
    homeLogoImageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export const SiteSettings =
  models.SiteSettings ?? model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
