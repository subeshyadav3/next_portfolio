import { unstable_cache } from "next/cache";
import { PostStatus, Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma";
import type {
  AdjacentPosts,
  ListOptions,
  NormalizedArchiveYear,
  NormalizedCategory,
  NormalizedPost,
  NormalizedPostSummary,
  NormalizedTag,
} from "./types";
import type { PostSource } from "./post-source";
import { tagSlug } from "@/lib/blog/slugs";
import { getCategorySlug, getCategoryLabel } from "@/lib/blog/categories";
import { getYear } from "@/lib/blog/utils";

/* -------------------------------------------------------------------------- */
/*  Mappers                                                                   */
/* -------------------------------------------------------------------------- */

type DbPost = Prisma.PostGetPayload<{
  include: {
    author: true;
    category: true;
    tags: { include: { tag: true } };
    coverMedia: true;
  };
}>;

function toNormalized(p: DbPost): NormalizedPost {
  return {
    slug: p.slug,
    title: p.title,
    description: p.excerpt ?? "",
    content: p.content,
    published: (p.publishedAt ?? p.createdAt).toISOString(),
    updated: p.updatedAt.toISOString(),
    category: p.category?.slug ?? "uncategorized",
    tags: p.tags.map((pt) => pt.tag.name),
    author: p.author.name,
    authorUrl: p.author.websiteUrl ?? "https://subeshyadav.com.np",
    image: p.coverMedia?.secureUrl ?? "",
    readingTime: p.readingTimeMin,
    featured: p.featured,
    language: (p.language as "en" | "ne") ?? "en",
    classLevel: p.classLevel,
    subject: p.subject,
    board: p.board,
    difficulty: p.difficulty,
    examType: p.examType,
    series: p.series,
    source: p.source as "DB" | "FILE" | "IMPORTED",
  };
}

function summarize(p: NormalizedPost): NormalizedPostSummary {
  const { content, ...s } = p;
  return s;
}

const POST_INCLUDE = {
  author: true,
  category: true,
  tags: { include: { tag: true } },
  coverMedia: true,
} as const;

/** Visibility filter for public reads — only PUBLISHED posts, only past-scheduled. */
const publicFilter = (): Prisma.PostWhereInput => ({
  status: PostStatus.PUBLISHED,
  OR: [{ scheduledFor: null }, { scheduledFor: { lte: new Date() } }],
  AND: [{ OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] }],
});

function paginate<T>(items: T[], opts?: ListOptions): T[] {
  if (!opts) return items;
  const offset = opts.offset ?? 0;
  const limit = opts.limit ?? items.length;
  return items.slice(offset, offset + limit);
}

function chapterNumber(text: string): number | null {
  const patterns = [
    /lesson\s*(\d+)/i,
    /chapter\s*(\d+)/i,
    /lesson-(\d+)/i,
    /chapter-(\d+)/i,
  ];
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m) return parseInt(m[1], 10);
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/*  Source implementation                                                     */
/* -------------------------------------------------------------------------- */

export class PrismaPostSource implements PostSource {
  private langWhere(opts?: ListOptions): { language?: string } {
    return opts?.language ? { language: opts.language } : {};
  }

  async list(opts?: ListOptions): Promise<NormalizedPostSummary[]> {
    const posts = await prisma.post.findMany({
      where: {
        ...(opts?.includeUnpublished ? {} : publicFilter()),
        ...this.langWhere(opts),
      },
      include: POST_INCLUDE,
      orderBy: { publishedAt: "desc" },
    });
    return paginate(posts.map((p) => summarize(toNormalized(p))), opts);
  }

  async get(
    slug: string,
    opts?: { includeUnpublished?: boolean }
  ): Promise<NormalizedPost | null> {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: POST_INCLUDE,
    });
    if (!post) return null;
    if (!opts?.includeUnpublished) {
      const visible = post.status === PostStatus.PUBLISHED;
      const scheduledOk =
        !post.scheduledFor || post.scheduledFor <= new Date();
      const notExpired = !post.expiresAt || post.expiresAt > new Date();
      if (!visible || !scheduledOk || !notExpired) return null;
    }
    return toNormalized(post);
  }

  async has(
    slug: string,
    opts?: { includeUnpublished?: boolean }
  ): Promise<boolean> {
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { status: true, scheduledFor: true, expiresAt: true },
    });
    if (!post) return false;
    if (opts?.includeUnpublished) return true;
    if (post.status !== PostStatus.PUBLISHED) return false;
    if (post.scheduledFor && post.scheduledFor > new Date()) return false;
    if (post.expiresAt && post.expiresAt <= new Date()) return false;
    return true;
  }

  async byCategory(
    slug: string,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const cat = await prisma.category.findUnique({ where: { slug } });
    if (!cat) return [];
    const posts = await prisma.post.findMany({
      where: {
        categoryId: cat.id,
        ...(opts?.includeUnpublished ? {} : publicFilter()),
        ...this.langWhere(opts),
      },
      include: POST_INCLUDE,
      orderBy: { publishedAt: "desc" },
    });
    return paginate(posts.map((p) => summarize(toNormalized(p))), opts);
  }

  async byTag(slug: string, opts?: ListOptions): Promise<NormalizedPostSummary[]> {
    const tag = await prisma.tag.findUnique({ where: { slug } });
    if (!tag) return [];
    const posts = await prisma.post.findMany({
      where: {
        tags: { some: { tagId: tag.id } },
        ...(opts?.includeUnpublished ? {} : publicFilter()),
        ...this.langWhere(opts),
      },
      include: POST_INCLUDE,
      orderBy: { publishedAt: "desc" },
    });
    return paginate(posts.map((p) => summarize(toNormalized(p))), opts);
  }

  async byYear(
    year: string,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const start = new Date(`${year}-01-01T00:00:00Z`);
    const end = new Date(`${year}-12-31T23:59:59Z`);
    const posts = await prisma.post.findMany({
      where: {
        publishedAt: { gte: start, lte: end },
        ...(opts?.includeUnpublished ? {} : publicFilter()),
        ...this.langWhere(opts),
      },
      include: POST_INCLUDE,
      orderBy: { publishedAt: "desc" },
    });
    return paginate(posts.map((p) => summarize(toNormalized(p))), opts);
  }

  async categories(opts?: ListOptions): Promise<NormalizedCategory[]> {
    const cats = await prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
    });
    // Filtered count: use a raw group-by query.
    const rows = await prisma.$queryRaw<Array<{ slug: string; count: bigint }>>`
      SELECT c.slug, COUNT(p.id) AS count
      FROM "Category" c
      LEFT JOIN "Post" p ON p."categoryId" = c.id
        AND p.status = 'PUBLISHED'
        AND (p."scheduledFor" IS NULL OR p."scheduledFor" <= NOW())
        AND (p."expiresAt" IS NULL OR p."expiresAt" > NOW())
        ${opts?.language ? Prisma.sql`AND p.language = ${opts.language}` : Prisma.empty}
      GROUP BY c.slug
    `;
    const countMap = new Map(rows.map((r) => [r.slug, Number(r.count)]));
    return cats.map((c) => ({
      name: c.name,
      slug: c.slug,
      count: countMap.get(c.slug) ?? 0,
    }));
  }

  async tags(opts?: ListOptions): Promise<NormalizedTag[]> {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
    });
    // Filtered count requires a separate query through PostTag → Post.
    const counts = await prisma.post.groupBy({
      by: ["id"],
      where: { tags: { some: { tag: { slug: { in: tags.map((t) => t.slug) } } } }, ...publicFilter() },
      _count: true,
    });
    const totalPosts = await prisma.post.count({ where: { tags: { some: {} }, ...publicFilter() } });
    // Simpler: count per tag via raw grouping
    const tagCounts = await prisma.$queryRaw<Array<{ slug: string; count: bigint }>>`
      SELECT t.slug, COUNT(p.id) AS count
      FROM "Tag" t
      LEFT JOIN "PostTag" pt ON pt."tagId" = t.id
      LEFT JOIN "Post" p ON p.id = pt."postId"
        AND p.status = 'PUBLISHED'
        AND (p."scheduledFor" IS NULL OR p."scheduledFor" <= NOW())
        AND (p."expiresAt" IS NULL OR p."expiresAt" > NOW())
        ${opts?.language ? Prisma.sql`AND p.language = ${opts.language}` : Prisma.empty}
      GROUP BY t.slug
    `;
    const countMap = new Map(tagCounts.map((r) => [r.slug, Number(r.count)]));
    return tags.map((t) => ({
      name: t.name,
      slug: t.slug,
      count: countMap.get(t.slug) ?? 0,
    }));
  }

  async archiveYears(opts?: ListOptions): Promise<NormalizedArchiveYear[]> {
    const posts = await prisma.post.findMany({
      where: { ...publicFilter(), ...this.langWhere(opts) },
      select: { publishedAt: true },
    });
    const map = new Map<string, number>();
    for (const p of posts) {
      if (!p.publishedAt) continue;
      const y = getYear(p.publishedAt.toISOString());
      if (y) map.set(y, (map.get(y) ?? 0) + 1);
    }
    return [...map.entries()]
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => b.year.localeCompare(a.year));
  }

  async related(
    post: NormalizedPost,
    count = 3
  ): Promise<NormalizedPostSummary[]> {
    // Use RelatedPost rows first; fall back to category+tag scoring.
    const explicit = await prisma.relatedPost.findMany({
      where: { from: { slug: post.slug } },
      include: { to: { include: POST_INCLUDE } },
      orderBy: { score: "desc" },
      take: count,
    });
    if (explicit.length >= count) {
      return explicit.map((r) => summarize(toNormalized(r.to)));
    }
    // Fallback: category+tag scoring
    const all = await prisma.post.findMany({
      where: { slug: { not: post.slug }, ...publicFilter(), language: post.language },
      include: POST_INCLUDE,
    });
    const scored = all.map((p) => {
      let score = 0;
      if (getCategorySlug(p.category?.slug ?? "") === getCategorySlug(post.category)) score += 5;
      score += p.tags.filter((pt) => post.tags.includes(pt.tag.name)).length * 2;
      return { p, score };
    });
    scored.sort((a, b) => b.score - a.score);
    const remaining = count - explicit.length;
    return [
      ...explicit.map((r) => summarize(toNormalized(r.to))),
      ...scored.slice(0, remaining).map((s) => summarize(toNormalized(s.p))),
    ];
  }

  async prevNext(post: NormalizedPost): Promise<AdjacentPosts> {
    const all = await prisma.post.findMany({
      where: { ...publicFilter(), language: post.language },
      select: { slug: true, publishedAt: true },
      orderBy: { publishedAt: "asc" },
    });
    const i = all.findIndex((p) => p.slug === post.slug);
    if (i < 0) return { prev: null, next: null };
    const [prevSlug, nextSlug] = [
      i > 0 ? all[i - 1].slug : null,
      i < all.length - 1 ? all[i + 1].slug : null,
    ];
    const [prev, next] = await Promise.all([
      prevSlug ? this.get(prevSlug) : Promise.resolve(null),
      nextSlug ? this.get(nextSlug) : Promise.resolve(null),
    ]);
    return { prev, next };
  }

  async adjacentChapters(post: NormalizedPost): Promise<AdjacentPosts> {
    const current = chapterNumber(post.title) ?? chapterNumber(post.slug);
    if (current === null) return { prev: null, next: null };
    const all = await prisma.post.findMany({
      where: {
        slug: { not: post.slug },
        category: { slug: getCategorySlug(post.category) },
        ...publicFilter(),
        language: post.language,
      },
      select: { slug: true, title: true },
    });
    const numbered = all
      .map((p) => ({
        p,
        number: chapterNumber(p.title) ?? chapterNumber(p.slug),
      }))
      .filter(
        (x): x is { p: { slug: string; title: string }; number: number } =>
          x.number !== null
      )
      .sort((a, b) => a.number - b.number);
    const i = numbered.findIndex((x) => x.number === current);
    if (i < 0) return { prev: null, next: null };
    const [prev, next] = await Promise.all([
      i > 0 ? this.get(numbered[i - 1].p.slug) : Promise.resolve(null),
      i < numbered.length - 1 ? this.get(numbered[i + 1].p.slug) : Promise.resolve(null),
    ]);
    return { prev, next };
  }

  async featured(opts?: ListOptions): Promise<NormalizedPostSummary | null> {
    const p = await prisma.post.findFirst({
      where: { featured: true, ...publicFilter(), ...this.langWhere(opts) },
      include: POST_INCLUDE,
      orderBy: { publishedAt: "desc" },
    });
    if (p) return summarize(toNormalized(p));
    const any = await this.latest(1);
    return any[0] ?? null;
  }

  async popular(count = 6, opts?: ListOptions): Promise<NormalizedPostSummary[]> {
    // Heuristic: posts with cover image and >= 3 min reading.
    const posts = await prisma.post.findMany({
      where: { coverMediaId: { not: null }, readingTimeMin: { gte: 3 }, ...publicFilter(), ...this.langWhere(opts) },
      include: POST_INCLUDE,
      orderBy: { publishedAt: "desc" },
      take: count,
    });
    return posts.map((p) => summarize(toNormalized(p)));
  }

  async recentlyUpdated(count = 6, opts?: ListOptions): Promise<NormalizedPostSummary[]> {
    const posts = await prisma.post.findMany({
      where: { ...publicFilter(), ...this.langWhere(opts) },
      include: POST_INCLUDE,
      orderBy: { updatedAt: "desc" },
      take: count,
    });
    return posts.map((p) => summarize(toNormalized(p)));
  }

  async editorPicks(count = 4, opts?: ListOptions): Promise<NormalizedPostSummary[]> {
    // Deterministic pick: featured + sticky first, then newest.
    const posts = await prisma.post.findMany({
      where: { OR: [{ featured: true }, { sticky: true }], ...publicFilter(), ...this.langWhere(opts) },
      include: POST_INCLUDE,
      orderBy: [{ featured: "desc" }, { sticky: "desc" }, { publishedAt: "desc" }],
      take: count,
    });
    if (posts.length >= count) return posts.map((p) => summarize(toNormalized(p)));
    const fillers = await prisma.post.findMany({
      where: { slug: { notIn: posts.map((p) => p.slug) }, ...publicFilter(), ...this.langWhere(opts) },
      include: POST_INCLUDE,
      orderBy: { publishedAt: "desc" },
      take: count - posts.length,
    });
    return [...posts, ...fillers].map((p) => summarize(toNormalized(p)));
  }

  async latest(count = 6, opts?: ListOptions): Promise<NormalizedPostSummary[]> {
    const posts = await prisma.post.findMany({
      where: { ...publicFilter(), ...this.langWhere(opts) },
      include: POST_INCLUDE,
      orderBy: { publishedAt: "desc" },
      take: count,
    });
    return posts.map((p) => summarize(toNormalized(p)));
  }

  async invalidate(slug?: string): Promise<void> {
    const { revalidateTag } = await import("next/cache");
    revalidateTag(`post:${slug ?? "*"}`);
    revalidateTag("posts:list");
  }
}
