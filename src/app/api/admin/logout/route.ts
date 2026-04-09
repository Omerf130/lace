import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";
import type { ApiResponse } from "@/types";

export async function POST() {
  try {
    await clearAuthCookie();
    return NextResponse.json<ApiResponse>({ success: true });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Logout failed",
      },
      { status: 500 }
    );
  }
}
