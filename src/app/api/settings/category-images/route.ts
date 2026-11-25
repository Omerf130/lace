import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { getAuthFromCookies } from "@/lib/auth";
import { SiteSettings } from "@/models/SiteSettings";
import type { ApiResponse } from "@/types";

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return settings;
}

export async function PUT(request: NextRequest) {
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

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const update: Record<string, string> = {};

    if (body.categoryWomenImageUrl !== undefined) {
      update.categoryWomenImageUrl = String(body.categoryWomenImageUrl).trim();
    }
    if (body.categoryMenImageUrl !== undefined) {
      update.categoryMenImageUrl = String(body.categoryMenImageUrl).trim();
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "No category image fields to update" },
        { status: 400 }
      );
    }

    const settings = await getOrCreateSettings();
    Object.assign(settings, update);
    await settings.save();

    revalidatePath("/categories");

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        categoryWomenImageUrl: settings.categoryWomenImageUrl ?? "",
        categoryMenImageUrl: settings.categoryMenImageUrl ?? "",
      },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update category images",
      },
      { status: 500 }
    );
  }
}