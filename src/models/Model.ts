import { Schema, model, models } from "mongoose";
import slugify from "slugify";
import type { IModel } from "@/types";

const ModelSchema = new Schema<IModel>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    category: {
      type: String,
      enum: ["men", "women"],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    bio: { type: String, default: "" },
    instagramUrl: { type: String, default: "" },
    images: {
      main: { type: String, default: "" },
      gallery: { type: [String], default: [] },
      coverVideo: { type: String, default: "" },
      pdf: { type: String, default: "" },
    },
    attributes: {
      height: { type: Number, default: 0 },
      bust: { type: Number, default: 0 },
      waist: { type: Number, default: 0 },
      hips: { type: Number, default: 0 },
      shoes: { type: Number, default: 0 },
      hair: { type: String, default: "" },
      eyes: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

ModelSchema.pre("validate", function () {
  if (this.firstName && this.lastName) {
    this.slug = slugify(`${this.firstName} ${this.lastName}`, {
      lower: true,
      strict: true,
    });
  }
});

export const TalentModel =
  models.TalentModel ?? model<IModel>("TalentModel", ModelSchema);
