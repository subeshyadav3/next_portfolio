/**
 * Edge middleware.
 *
 * Uses the thin edge-safe auth config (`@/lib/auth/edge-config`) which only
 * verifies JWTs — no Prisma, no bcrypt. The full config with the database
 * adapter lives in `@/lib/auth/config` and is consumed only by the
 * `/api/auth/[...nextauth]` route handler.
 */
import { auth } from "@/lib/auth/edge-config";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Allow login page, API auth routes, and static files
  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return;
  }

  // Protect all other /admin routes
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/admin/login", req.nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based access for /admin/users
    const role = (req.auth?.user as { role?: string } | undefined)?.role;
    if (pathname.startsWith("/admin/users") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.nextUrl));
    }
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
