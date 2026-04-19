import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { serializeModels } from "@/lib/serialize";
import { TalentModel } from "@/models/Model";
import type { ApiResponse, IModel, SerializedModel } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q")?.trim();

    if (!q) {
      return NextResponse.json<ApiResponse<SerializedModel[]>>({
        success: true,
        data: [],
      });
    }

    await connectToDatabase();

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");

    const results = await TalentModel.find({
      status: "published",
      $or: [
        { firstName: regex },
        { lastName: regex },
        { category: regex },
      ],
    })
      .sort({ lastName: 1, firstName: 1 })
      .limit(50)
      .lean<IModel[]>();

    return NextResponse.json<ApiResponse<SerializedModel[]>>({
      success: true,
      data: serializeModels(results),
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Search failed",
      },
      { status: 500 }
    );
  }
}
