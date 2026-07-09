import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "fallback-secret");

// NextAuth v5 cookie names (both development and production)
const AUTH_COOKIE_NAMES = [
  "authjs.session-token",
  "__session",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "__Host-next-auth.session-token",
  "next-auth.callback-url",
  "next-auth.csrf-token",
];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login page, API auth routes, and static files - NO AUTH CHECK
  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Protect all other /admin routes
  if (pathname.startsWith("/admin")) {
    const token = AUTH_COOKIE_NAMES
      .map((name) => req.cookies.get(name)?.value)
      .find(Boolean);

    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const role = payload.role as string | undefined;

      // Role-based access for /admin/users
      if (pathname.startsWith("/admin/users") && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    } catch {
      // Invalid token - clear it and redirect to login
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      const response = NextResponse.redirect(loginUrl);
      // Clear all auth cookies
      AUTH_COOKIE_NAMES.forEach((name) => {
        response.cookies.delete(name);
      });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
