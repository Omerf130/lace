import type { IModel, SerializedModel, IInfluencer, SerializedInfluencer } from "@/types";

export function serializeModel(model: IModel): SerializedModel {
  return {
    _id: model._id.toString(),
    firstName: model.firstName,
    lastName: model.lastName,
    slug: model.slug,
    category: model.category,
    status: model.status,
    isAiModel: model.isAiModel === true,
    instagramUrl: model.instagramUrl || "",
    images: {
      main: model.images.main,
      gallery: [...model.images.gallery],
      horizontalGallery: [...(model.images.horizontalGallery ?? [])],
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

export function serializeInfluencer(inf: IInfluencer): SerializedInfluencer {
  return {
    _id: inf._id.toString(),
    firstName: inf.firstName,
    lastName: inf.lastName,
    slug: inf.slug,
    status: inf.status,
    image: inf.image,
    tiktokUrl: inf.tiktokUrl || "",
    tiktokFollowers: inf.tiktokFollowers || 0,
    instagramUrl: inf.instagramUrl || "",
    instagramFollowers: inf.instagramFollowers || 0,
    createdAt: inf.createdAt.toISOString(),
    updatedAt: inf.updatedAt.toISOString(),
  };
}

export function serializeInfluencers(infs: IInfluencer[]): SerializedInfluencer[] {
  return infs.map(serializeInfluencer);
}
