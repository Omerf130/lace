import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { getAuthFromCookies } from "@/lib/auth";
import { TalentModel } from "@/models/Model";
import type { ApiResponse } from "@/types";

export async function PATCH(request: NextRequest) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    const orderedIds = (body && Array.isArray(body.orderedIds))
      ? (body.orderedIds as unknown[]).filter((v): v is string => typeof v === "string")
      : null;

    if (!orderedIds) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Expected { orderedIds: string[] } in body" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    if (orderedIds.length > 0) {
      const ops = orderedIds.map((id, idx) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { sortOrder: (idx + 1) * 1000 } },
        },
      }));
      await TalentModel.bulkWrite(ops);
    }

    revalidatePath("/models/men");
    revalidatePath("/models/women");
    revalidatePath("/models/ai");

    return NextResponse.json<ApiResponse>({ success: true });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update order",
      },
      { status: 500 }
    );
  }
}
