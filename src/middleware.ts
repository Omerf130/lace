import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "lace_token";
const LOGIN_PATH = "/admin/login";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // JWT structure validation (full verify happens in API routes / server
  // components — middleware runs on the Edge and can't use the Node.js
  // jsonwebtoken library). We check the token has 3 parts and isn't expired
  // by decoding the payload without verifying the signature.
  try {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("malformed");

    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString()
    );
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      throw new Error("expired");
    }
  } catch {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
