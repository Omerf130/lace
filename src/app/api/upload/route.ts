import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { uploadImage } from "@/lib/blob";
import type { ApiResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "No files provided" },
        { status: 400 }
      );
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: `Invalid file type: ${file.type}` },
          { status: 400 }
        );
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: `File too large: ${file.name}` },
          { status: 400 }
        );
      }
    }

    const urls = await Promise.all(files.map(uploadImage));

    return NextResponse.json<ApiResponse<{ urls: string[] }>>(
      { success: true, data: { urls } },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}
