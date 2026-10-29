/**
 * Async post readers — thin wrappers around the new `@/lib/content` source.
 *
 * All readers now return Promises because the underlying source may hit the
 * DB. The public reader pages have been updated to `await` these calls.
 *
 * Prefer importing directly from `@/lib/content` in new code:
 *
 *   import { posts } from "@/lib/content";
 *   const list = await posts.list();
 *
 * The legacy `lib/blog/types.ts` Post shape is preserved here for
 * backwards compatibility, but new code should use `NormalizedPost` from
 * `@/lib/content`.
 */
import { posts as defaultSource } from "@/lib/content";
import type {
  NormalizedPost as Post,
  NormalizedPostSummary as PostSummary,
  NormalizedCategory as Category,
  NormalizedTag as Tag,
  NormalizedArchiveYear as ArchiveYear,
  AdjacentPosts,
} from "@/lib/content";

/* ---------- Backwards-compatible Post type alias ---------- */
// Keep old name `Post` available so we don't need to refactor every
// consumer signature yet.
export type { Post, PostSummary, Category, Tag, ArchiveYear, AdjacentPosts };

const SHOW_ALL = process.env.SHOW_ALL_LANGUAGES === "true";

function langOpts(): { language: "en" } | undefined {
  return SHOW_ALL ? undefined : { language: "en" };
}

/* ---------- Async readers ---------- */

export async function getAllPosts(opts?: { limit?: number; offset?: number }) {
  return defaultSource.list({ ...langOpts(), ...opts });
}

export async function getPostBySlug(slug: string) {
  const post = await defaultSource.get(slug);
  if (!SHOW_ALL && post?.language !== "en") return null;
  return post;
}

export async function getPostsByCategory(slug: string, opts?: { limit?: number; offset?: number }) {
  return defaultSource.byCategory(slug, { ...langOpts(), ...opts });
}

export async function getPostsByTag(tagName: string, opts?: { limit?: number; offset?: number }) {
  return defaultSource.byTag(tagName, { ...langOpts(), ...opts });
}

export async function getPostsByYear(year: string, opts?: { limit?: number; offset?: number }) {
  return defaultSource.byYear(year, { ...langOpts(), ...opts });
}

export async function getCategories() {
  return defaultSource.categories(langOpts());
}

export async function getTags() {
  return defaultSource.tags(langOpts());
}

export async function getArchiveYears() {
  return defaultSource.archiveYears(langOpts());
}

export async function getRelatedPosts(currentPost: Post, count = 3) {
  return defaultSource.related(currentPost, count);
}

export async function getPrevNextPosts(currentPost: Post): Promise<AdjacentPosts> {
  return defaultSource.prevNext(currentPost);
}

export async function getLatestPosts(count = 6) {
  return defaultSource.latest(count, langOpts());
}

export async function getFeaturedPost() {
  return defaultSource.featured(langOpts());
}

export async function getPopularPosts(count = 6) {
  return defaultSource.popular(count, langOpts());
}

export async function getRecentlyUpdated(count = 6) {
  return defaultSource.recentlyUpdated(count, langOpts());
}

export async function getEditorPicks(count = 4) {
  return defaultSource.editorPicks(count, langOpts());
}

export async function getAdjacentChapterPosts(post: Post) {
  return defaultSource.adjacentChapters(post);
}

/* ---------- Author readers ---------- */

export interface AuthorProfile {
  id: string;
  slug: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  websiteUrl: string | null;
  social: Record<string, string> | null;
  postCount: number;
}

const DEFAULT_FALLBACK_AUTHOR: AuthorProfile = {
  id: "subesh-yadav",
  slug: "subesh-yadav",
  name: "Subesh Yadav",
  bio: "Creator & Lead Developer of Neb Master and subeshyadav.com.np",
  avatarUrl: "/profile.jpg",
  websiteUrl: "https://subeshyadav.com.np",
  social: {
    github: "https://github.com/subeshyadav3",
    linkedin: "https://linkedin.com/in/subeshyadav",
  },
  postCount: 0,
};

export async function getAllAuthors(): Promise<AuthorProfile[]> {
  try {
    const { prisma } = await import("@/db/prisma");
    const authors = await prisma.author.findMany({
      include: {
        posts: {
          where: {
            status: "PUBLISHED",
            OR: [{ scheduledFor: null }, { scheduledFor: { lte: new Date() } }],
          },
          select: { id: true },
        },
      },
      orderBy: { name: "asc" },
    });
    if (authors.length > 0) {
      return authors.map((a) => ({
        id: a.id,
        slug: a.slug,
        name: a.name,
        bio: a.bio,
        avatarUrl: a.avatarUrl,
        websiteUrl: a.websiteUrl,
        social: (a.social as Record<string, string>) ?? null,
        postCount: a.posts.length,
      }));
    }
  } catch (error) {
    console.warn("Failed to fetch authors from DB, falling back to default author:", error instanceof Error ? error.message : error);
  }

  const allPosts = await getAllPosts();
  return [
    {
      ...DEFAULT_FALLBACK_AUTHOR,
      postCount: allPosts.length,
    },
  ];
}

export async function getAuthorBySlug(
  slug: string
): Promise<AuthorProfile | null> {
  try {
    const { prisma } = await import("@/db/prisma");
    const author = await prisma.author.findUnique({
      where: { slug },
      include: {
        posts: {
          where: {
            status: "PUBLISHED",
            OR: [{ scheduledFor: null }, { scheduledFor: { lte: new Date() } }],
          },
          select: { id: true },
        },
      },
    });
    if (author) {
      return {
        id: author.id,
        slug: author.slug,
        name: author.name,
        bio: author.bio,
        avatarUrl: author.avatarUrl,
        websiteUrl: author.websiteUrl,
        social: (author.social as Record<string, string>) ?? null,
        postCount: author.posts.length,
      };
    }
  } catch (error) {
    console.warn(`Failed to fetch author "${slug}" from DB, falling back:`, error instanceof Error ? error.message : error);
  }

  if (slug === "subesh-yadav" || slug === "subesh") {
    const allPosts = await getAllPosts();
    return {
      ...DEFAULT_FALLBACK_AUTHOR,
      postCount: allPosts.length,
    };
  }
  return null;
}

export async function getPostsByAuthor(
  authorSlug: string,
  opts?: { limit?: number; offset?: number }
) {
  try {
    const { prisma } = await import("@/db/prisma");
    const author = await prisma.author.findUnique({
      where: { slug: authorSlug },
      select: { id: true, name: true },
    });
    if (author) {
      const posts = await prisma.post.findMany({
        where: {
          authorId: author.id,
          status: "PUBLISHED",
          OR: [{ scheduledFor: null }, { scheduledFor: { lte: new Date() } }],
          AND: [{ OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] }],
        },
        include: {
          category: true,
          tags: { include: { tag: true } },
          coverMedia: true,
        },
        orderBy: { publishedAt: "desc" },
        take: opts?.limit,
        skip: opts?.offset,
      });

      const visiblePosts = SHOW_ALL ? posts : posts.filter((p) => p.language === "en");
      return visiblePosts.map((p) => ({
        slug: p.slug,
        title: p.title,
        description: p.excerpt ?? "",
        published: (p.publishedAt ?? p.createdAt).toISOString(),
        updated: p.updatedAt.toISOString(),
        category: p.category?.slug ?? "uncategorized",
        tags: p.tags.map((pt) => pt.tag.name),
        author: author.name ?? authorSlug,
        authorSlug: authorSlug,
        authorUrl: "",
        image: p.coverMedia?.secureUrl ?? "",
        readingTime: p.readingTimeMin,
        featured: p.featured,
        language: (p.language as "en" | "ne") ?? "en",
      }));
    }
  } catch (error) {
    console.warn(`Failed to fetch posts for author "${authorSlug}" from DB, falling back:`, error instanceof Error ? error.message : error);
  }

  if (authorSlug === "subesh-yadav" || authorSlug === "subesh") {
    const all = await getAllPosts();
    const start = opts?.offset ?? 0;
    const end = opts?.limit ? start + opts.limit : undefined;
    return all.slice(start, end);
  }
  return [];
}
