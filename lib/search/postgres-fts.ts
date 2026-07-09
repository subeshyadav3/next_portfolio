import { prisma } from "@/db/prisma";

export interface SearchResult {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  publishedAt: Date | null;
  readingTimeMin: number;
  rank: number;
}

/**
 * Search published posts using Postgres full-text search.
 * Falls back gracefully if DB is unavailable.
 */
export async function searchPostsFts(
  query: string,
  options?: {
    category?: string;
    tag?: string;
    limit?: number;
    offset?: number;
  }
): Promise<{ results: SearchResult[]; total: number }> {
  const limit = options?.limit ?? 20;
  const offset = options?.offset ?? 0;

  const SHOW_ALL = process.env.SHOW_ALL_LANGUAGES === "true";

  // Build the WHERE clauses safely
  const conditions: string[] = [
    `p.status = 'PUBLISHED'`,
    `p.search_vector @@ plainto_tsquery('simple', $1)`,
  ];
  const params: string[] = [query];
  let paramIndex = 2;

  if (!SHOW_ALL) {
    conditions.push(`p.language = $${paramIndex}`);
    params.push("en");
    paramIndex++;
  }

  if (options?.category) {
    conditions.push(`c.slug = $${paramIndex}`);
    params.push(options.category);
    paramIndex++;
  }

  if (options?.tag) {
    conditions.push(`
      EXISTS (
        SELECT 1 FROM "PostTag" pt
        JOIN "Tag" t ON t.id = pt."tagId"
        WHERE pt."postId" = p.id AND t.slug = $${paramIndex}
      )
    `);
    params.push(options.tag);
    paramIndex++;
  }

  const whereClause = conditions.join(" AND ");

  const [rows, countResult] = await Promise.all([
    prisma.$queryRawUnsafe<SearchResult[]>(
      `
      SELECT
        p.id,
        p.slug,
        p.title,
        p.excerpt,
        c.name AS "categoryName",
        c.slug AS "categorySlug",
        p."publishedAt",
        p."readingTimeMin",
        ts_rank(p.search_vector, plainto_tsquery('simple', $1)) AS rank
      FROM "Post" p
      LEFT JOIN "Category" c ON c.id = p."categoryId"
      WHERE ${whereClause}
      ORDER BY rank DESC, p."publishedAt" DESC NULLS LAST
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `,
      ...params,
      limit,
      offset
    ),
    prisma.$queryRawUnsafe<{ count: bigint }[]>(
      `
      SELECT COUNT(*) AS count
      FROM "Post" p
      LEFT JOIN "Category" c ON c.id = p."categoryId"
      WHERE ${whereClause}
      `,
      ...params
    ),
  ]);

  const total = Number(countResult[0]?.count ?? 0);

  return { results: rows, total };
}
