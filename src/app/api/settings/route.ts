import { NextRequest, NextResponse } from "next/server";
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

export async function GET() {
  try {
    await connectToDatabase();
    const settings = await getOrCreateSettings();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: settings,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch settings",
      },
      { status: 500 }
    );
  }
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
    const { coverVideoUrl, coverImageUrl, coverType } = body;

    const update: Record<string, string> = {};
    if (coverVideoUrl !== undefined) update.coverVideoUrl = coverVideoUrl;
    if (coverImageUrl !== undefined) update.coverImageUrl = coverImageUrl;
    if (coverType !== undefined) update.coverType = coverType;

    const settings = await getOrCreateSettings();
    Object.assign(settings, update);
    await settings.save();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: settings,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update settings",
      },
      { status: 500 }
    );
  }
}
