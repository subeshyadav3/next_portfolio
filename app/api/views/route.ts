import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

const RESERVED_BLOG_SEGMENTS = new Set([
  "category",
  "tag",
  "archive",
  "rss.xml",
  "privacy",
  "terms",
  "disclaimer",
  "author",
  "about",
  "contact",
  "search",
]);

export async function POST(request: Request) {
  try {
    let path = "";
    let slug: string | null = null;

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json().catch(() => ({}));
      path = typeof body.path === "string" ? body.path.trim() : "";
      slug = typeof body.slug === "string" && body.slug.trim() ? body.slug.trim() : null;
    } else {
      const text = await request.text().catch(() => "");
      path = text.trim();
    }

    if (!path && !slug) {
      return NextResponse.json({ ok: false, message: "Missing path or slug" }, { status: 400 });
    }

    // Sanitize path (strip query params, hash)
    const cleanPath = path ? path.split("?")[0].split("#")[0] : (slug ? `/blog/${slug}` : "/");

    // If slug not provided, try to extract from /blog/<slug>
    if (!slug && cleanPath.startsWith("/blog/")) {
      const segments = cleanPath.replace(/^\/blog\//, "").split("/");
      const candidate = segments[0];
      if (candidate && !RESERVED_BLOG_SEGMENTS.has(candidate)) {
        slug = candidate;
      }
    }

    // Record page view in PageView table
    await prisma.pageView.create({
      data: {
        path: cleanPath || "/",
        slug: slug || null,
      },
    });

    // If it's a blog post, increment Post.views
    if (slug) {
      await prisma.post.updateMany({
        where: { slug },
        data: { views: { increment: 1 } },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Fail silently so tracking never breaks user experience
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
