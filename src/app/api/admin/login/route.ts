import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { comparePassword, signToken, setAuthCookie } from "@/lib/auth";
import { User } from "@/models/User";
import type { ApiResponse, JwtPayload } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const payload: JwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = signToken(payload);
    await setAuthCookie(token);

    return NextResponse.json<ApiResponse<{ email: string; role: string }>>({
      success: true,
      data: { email: user.email, role: user.role },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      },
      { status: 500 }
    );
  }
}
