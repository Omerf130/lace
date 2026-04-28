import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { getAuthFromCookies } from "@/lib/auth";
import { serializeModels } from "@/lib/serialize";
import { TalentModel } from "@/models/Model";
import type {
  ApiResponse,
  PaginatedResponse,
  IModel,
  ModelCategory,
  SerializedModel,
} from "@/types";

const DEFAULT_LIMIT = 12;
const VALID_CATEGORIES: ModelCategory[] = ["men", "women"];

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category") as ModelCategory | null;
    const cursor = searchParams.get("cursor");
    const limit = Math.min(
      Number(searchParams.get("limit")) || DEFAULT_LIMIT,
      50
    );

    const filter: Record<string, unknown> = {};

    // Admin can request all models (including drafts) via ?status=all
    const statusParam = searchParams.get("status");
    if (statusParam === "all") {
      const auth = await getAuthFromCookies();
      if (!auth) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Not authenticated" },
          { status: 401 }
        );
      }
    } else {
      filter.status = "published";
    }

    if (category && VALID_CATEGORIES.includes(category)) {
      filter.category = category;
    }

    const isAiParam = searchParams.get("isAiModel");
    if (isAiParam === "true") {
      filter.isAiModel = true;
    } else if (isAiParam === "false") {
      filter.isAiModel = { $ne: true };
    }

    if (cursor) {
      filter._id = { $gt: cursor };
    }

    const models = await TalentModel.find(filter)
      .sort({ _id: 1 })
      .limit(limit + 1)
      .lean<IModel[]>();

    const hasMore = models.length > limit;
    const items = hasMore ? models.slice(0, limit) : models;
    const nextCursor = hasMore
      ? items[items.length - 1]._id.toString()
      : null;

    return NextResponse.json<ApiResponse<PaginatedResponse<SerializedModel>>>({
      success: true,
      data: { items: serializeModels(items), nextCursor },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch models",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const body = await request.json();

    const talentModel = await TalentModel.create(body);

    revalidatePath("/models/men");
    revalidatePath("/models/women");
    revalidatePath("/models/ai");

    return NextResponse.json<ApiResponse<IModel>>(
      { success: true, data: talentModel.toObject() },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create model";

    const status =
      error instanceof Error && error.message.includes("duplicate")
        ? 409
        : 500;

    return NextResponse.json<ApiResponse>(
      { success: false, error: message },
      { status }
    );
  }
}
