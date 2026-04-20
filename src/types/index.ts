import type { Types } from "mongoose";

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  /** Machine-readable reason when useful for clients (e.g. FILE_TOO_LARGE) */
  errorCode?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  role: "admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: "admin";
}

// ─── Model (talent) ──────────────────────────────────────────────────────────

export type ModelCategory = "men" | "women";
export type ModelStatus = "draft" | "published";

export interface ModelAttributes {
  height: number;
  bust: number;
  waist: number;
  hips: number;
  shoes: number;
  hair: string;
  eyes: string;
}

export interface ModelImages {
  main: string;
  gallery: string[];
  /** Landscape-oriented shots; shown in a separate block on the model profile. */
  horizontalGallery?: string[];
  coverVideo?: string;
  pdf?: string;
}

export interface IModel {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  slug: string;
  category: ModelCategory;
  status: ModelStatus;
  /** When true, model appears under “AI models” on category pages. Omitted/false = regular list. */
  isAiModel?: boolean;
  instagramUrl?: string;
  images: ModelImages;
  attributes: ModelAttributes;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateModelInput = Omit<IModel, "_id" | "slug" | "createdAt" | "updatedAt">;
export type UpdateModelInput = Partial<CreateModelInput>;

// Serialized version safe for passing from Server to Client Components
export interface SerializedModel {
  _id: string;
  firstName: string;
  lastName: string;
  slug: string;
  category: ModelCategory;
  status: ModelStatus;
  isAiModel: boolean;
  instagramUrl?: string;
  images: ModelImages;
  attributes: ModelAttributes;
  createdAt: string;
  updatedAt: string;
}

// ─── Influencer ───────────────────────────────────────────────────────────────

export interface IInfluencer {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  slug: string;
  status: ModelStatus;
  image: string;
  tiktokUrl?: string;
  tiktokFollowers?: number;
  instagramUrl?: string;
  instagramFollowers?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SerializedInfluencer {
  _id: string;
  firstName: string;
  lastName: string;
  slug: string;
  status: ModelStatus;
  image: string;
  tiktokUrl?: string;
  tiktokFollowers?: number;
  instagramUrl?: string;
  instagramFollowers?: number;
  createdAt: string;
  updatedAt: string;
}
