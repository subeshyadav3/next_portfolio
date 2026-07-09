import { NextRequest } from "next/server";
import { getAllPosts, getCategories, getTags } from "@/lib/blog/posts";
import { buildSearchIndex, createFuseIndex, searchPosts } from "@/lib/blog/search";
import { searchPostsFts } from "@/lib/search/postgres-fts";
import { prisma } from "@/db/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const tag = searchParams.get("tag") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  // Try Postgres FTS first (needs DB with search_vector column)
  try {
    // Check if Postgres is connected by running a simple query
    await prisma.$queryRaw`SELECT 1`;

    const { results } = await searchPostsFts(query, {
      category: category || undefined,
      tag: tag || undefined,
      limit: 20,
      offset: (page - 1) * 20,
    });

    return Response.json({ source: "fts", results, total: results.length });
  } catch {
    // Fallback: use Fuse.js client-side search
    const posts = await getAllPosts();
    const searchIndex = buildSearchIndex(posts);
    const fuse = createFuseIndex(searchIndex);
    const results = searchPosts(fuse, query || " ", category || undefined, tag || undefined);

    return Response.json({
      source: "fuse",
      results: results.map((r) => ({
        slug: r.item.slug,
        title: r.item.title,
        excerpt: r.item.description,
        categorySlug: r.item.category,
        publishedAt: r.item.published,
        readingTimeMin: r.item.readingTime,
        rank: 1 - (r.score ?? 0),
      })),
      total: results.length,
    });
  }
}
