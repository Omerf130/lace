import { Schema, model, models } from "mongoose";

export interface IPageContent {
  page: string;
  content: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const PageContentSchema = new Schema<IPageContent>(
  {
    page: { type: String, required: true, unique: true, index: true },
    content: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const PageContent =
  models.PageContent ?? model<IPageContent>("PageContent", PageContentSchema);
