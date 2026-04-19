import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { getAuthFromCookies } from "@/lib/auth";
import { deleteFile } from "@/lib/blob";
import { Influencer } from "@/models/Influencer";
import type { ApiResponse, IInfluencer } from "@/types";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const influencer = await Influencer.findById(id).lean<IInfluencer>();
    if (!influencer) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Influencer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<IInfluencer>>({
      success: true,
      data: influencer,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch influencer",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    await connectToDatabase();

    const body = await request.json();
    const influencer = await Influencer.findById(id);
    if (!influencer) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Influencer not found" },
        { status: 404 }
      );
    }

    Object.assign(influencer, body);
    await influencer.save();

    revalidatePath("/influencers");

    return NextResponse.json<ApiResponse<IInfluencer>>({
      success: true,
      data: influencer.toObject(),
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update influencer",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    await connectToDatabase();

    const influencer = await Influencer.findById(id);
    if (!influencer) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Influencer not found" },
        { status: 404 }
      );
    }

    if (influencer.image) {
      await deleteFile(influencer.image).catch(() => {});
    }

    await Influencer.findByIdAndDelete(id);

    revalidatePath("/influencers");

    return NextResponse.json<ApiResponse>({ success: true });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete influencer",
      },
      { status: 500 }
    );
  }
}
