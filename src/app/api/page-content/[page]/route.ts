import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { getAuthFromCookies } from "@/lib/auth";
import { PageContent } from "@/models/PageContent";
import { validateAboutContent } from "@/lib/aboutContent";
import type { ApiResponse } from "@/types";

type RouteContext = { params: Promise<{ page: string }> };

const VALID_PAGES = ["about"] as const;
type ValidPage = (typeof VALID_PAGES)[number];

const REVALIDATE_PATHS: Record<ValidPage, string> = {
  about: "/about",
};

const VALIDATORS: Record<
  ValidPage,
  (data: unknown) => { ok: true; data: unknown } | { ok: false; error: string }
> = {
  about: validateAboutContent,
};

function isValidPage(page: string): page is ValidPage {
  return (VALID_PAGES as readonly string[]).includes(page);
}

export async function GET(_request: NextRequest, ctx: RouteContext) {
  try {
    const { page } = await ctx.params;

    if (!isValidPage(page)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unknown page" },
        { status: 404 }
      );
    }

    await connectToDatabase();
    const doc = await PageContent.findOne({ page }).lean();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: doc?.content ?? null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch content",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, ctx: RouteContext) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { page } = await ctx.params;

    if (!isValidPage(page)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unknown page" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const validator = VALIDATORS[page];
    const result = validator(body);
    if (!result.ok) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const doc = await PageContent.findOneAndUpdate(
      { page },
      { page, content: result.data },
      { upsert: true, new: true }
    );

    revalidatePath(REVALIDATE_PATHS[page]);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: doc.content,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update content",
      },
      { status: 500 }
    );
  }
}
