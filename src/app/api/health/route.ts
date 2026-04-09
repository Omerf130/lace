import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import type { ApiResponse } from "@/types";

export async function GET() {
  try {
    await connectToDatabase();
    const response: ApiResponse<{ db: string }> = {
      success: true,
      data: { db: "connected" },
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Database connection failed",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
