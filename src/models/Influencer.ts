import { Schema, model, models } from "mongoose";
import { slugFromNames } from "@/lib/slugFromNames";
import type { IInfluencer } from "@/types";

const InfluencerSchema = new Schema<IInfluencer>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    image: { type: String, default: "" },
    tiktokUrl: { type: String, default: "" },
    tiktokFollowers: { type: Number, default: 0 },
    instagramUrl: { type: String, default: "" },
    instagramFollowers: { type: Number, default: 0 },
  },
  { timestamps: true }
);

InfluencerSchema.pre("validate", function () {
  if (this.firstName && this.lastName) {
    this.slug = slugFromNames(this.firstName, this.lastName, "influencer");
  }
});

export const Influencer =
  models.Influencer ?? model<IInfluencer>("Influencer", InfluencerSchema);
