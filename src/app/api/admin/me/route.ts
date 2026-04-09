import { NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import type { ApiResponse, JwtPayload } from "@/types";

export async function GET() {
  try {
    const auth = await getAuthFromCookies();

    if (!auth) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json<ApiResponse<JwtPayload>>({
      success: true,
      data: auth,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Auth check failed",
      },
      { status: 500 }
    );
  }
}
