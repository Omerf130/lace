import type { Types } from "mongoose";

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
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
}

export interface IModel {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  slug: string;
  category: ModelCategory;
  bio: string;
  images: ModelImages;
  attributes: ModelAttributes;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateModelInput = Omit<IModel, "_id" | "slug" | "createdAt" | "updatedAt">;
export type UpdateModelInput = Partial<CreateModelInput>;
