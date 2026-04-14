import type { IModel, SerializedModel } from "@/types";

export function serializeModel(model: IModel): SerializedModel {
  return {
    _id: model._id.toString(),
    firstName: model.firstName,
    lastName: model.lastName,
    slug: model.slug,
    category: model.category,
    status: model.status,
    bio: model.bio,
    images: {
      main: model.images.main,
      gallery: [...model.images.gallery],
      coverVideo: model.images.coverVideo || "",
      pdf: model.images.pdf || "",
    },
    attributes: { ...model.attributes },
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export function serializeModels(models: IModel[]): SerializedModel[] {
  return models.map(serializeModel);
}
