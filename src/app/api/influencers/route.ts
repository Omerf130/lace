import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { getAuthFromCookies } from "@/lib/auth";
import { Influencer } from "@/models/Influencer";
import type { ApiResponse, PaginatedResponse, IInfluencer } from "@/types";

const DEFAULT_LIMIT = 12;

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = request.nextUrl;
    const cursor = searchParams.get("cursor");
    const limit = Math.min(
      Number(searchParams.get("limit")) || DEFAULT_LIMIT,
      50
    );

    const filter: Record<string, unknown> = {};

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

    if (cursor) {
      filter._id = { $gt: cursor };
    }

    const influencers = await Influencer.find(filter)
      .sort({ _id: 1 })
      .limit(limit + 1)
      .lean<IInfluencer[]>();

    const hasMore = influencers.length > limit;
    const items = hasMore ? influencers.slice(0, limit) : influencers;
    const nextCursor = hasMore
      ? items[items.length - 1]._id.toString()
      : null;

    return NextResponse.json<ApiResponse<PaginatedResponse<IInfluencer>>>({
      success: true,
      data: { items, nextCursor },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch influencers",
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

    const influencer = await Influencer.create(body);

    revalidatePath("/influencers");

    return NextResponse.json<ApiResponse<IInfluencer>>(
      { success: true, data: influencer.toObject() },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create influencer";

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
