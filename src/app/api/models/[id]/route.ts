import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { getAuthFromCookies } from "@/lib/auth";
import { deleteImage } from "@/lib/blob";
import { TalentModel } from "@/models/Model";
import type { ApiResponse, IModel } from "@/types";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const talentModel = await TalentModel.findById(id).lean<IModel>();
    if (!talentModel) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Model not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<IModel>>({
      success: true,
      data: talentModel,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch model",
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
    const talentModel = await TalentModel.findById(id);
    if (!talentModel) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Model not found" },
        { status: 404 }
      );
    }

    Object.assign(talentModel, body);
    await talentModel.save();

    revalidatePath(`/models/${talentModel.category}/${talentModel.slug}`);
    revalidatePath(`/models/${talentModel.category}`);

    return NextResponse.json<ApiResponse<IModel>>({
      success: true,
      data: talentModel.toObject(),
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update model",
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

    const talentModel = await TalentModel.findById(id);
    if (!talentModel) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Model not found" },
        { status: 404 }
      );
    }

    // Clean up blob images
    const imagesToDelete: string[] = [];
    if (talentModel.images.main) {
      imagesToDelete.push(talentModel.images.main);
    }
    if (talentModel.images.gallery?.length) {
      imagesToDelete.push(...talentModel.images.gallery);
    }

    const category = talentModel.category;

    await Promise.allSettled(imagesToDelete.map(deleteImage));
    await TalentModel.findByIdAndDelete(id);

    revalidatePath(`/models/${category}`);
    revalidatePath("/models/men");
    revalidatePath("/models/women");

    return NextResponse.json<ApiResponse>({ success: true });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete model",
      },
      { status: 500 }
    );
  }
}
