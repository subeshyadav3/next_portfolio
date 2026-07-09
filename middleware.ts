import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "fallback-secret");

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("authjs.session-token")?.value ?? req.cookies.get("__session")?.value;

  // Allow login page and API auth routes
  if (pathname.startsWith("/admin/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
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
      // Invalid token, redirect to login
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
