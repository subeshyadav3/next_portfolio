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
import type { PostSource } from "@/lib/content";
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

/** Swap the default source (used by tests). Not currently wired up. */
// export function setPostSource(source: PostSource) { /* see lib/content/CompositeSource */ }

/* ---------- Async readers ---------- */

export async function getAllPosts(opts?: { limit?: number; offset?: number }) {
  return defaultSource.list(opts);
}

export async function getPostBySlug(slug: string) {
  return defaultSource.get(slug);
}

export async function getPostsByCategory(slug: string, opts?: { limit?: number; offset?: number }) {
  return defaultSource.byCategory(slug, opts);
}

export async function getPostsByTag(tagName: string, opts?: { limit?: number; offset?: number }) {
  return defaultSource.byTag(tagName, opts);
}

export async function getPostsByYear(year: string, opts?: { limit?: number; offset?: number }) {
  return defaultSource.byYear(year, opts);
}

export async function getCategories() {
  return defaultSource.categories();
}

export async function getTags() {
  return defaultSource.tags();
}

export async function getArchiveYears() {
  return defaultSource.archiveYears();
}

export async function getRelatedPosts(currentPost: Post, count = 3) {
  return defaultSource.related(currentPost, count);
}

export async function getPrevNextPosts(currentPost: Post): Promise<AdjacentPosts> {
  return defaultSource.prevNext(currentPost);
}

export async function getLatestPosts(count = 6) {
  return defaultSource.latest(count);
}

export async function getFeaturedPost() {
  return defaultSource.featured();
}

export async function getPopularPosts(count = 6) {
  return defaultSource.popular(count);
}

export async function getRecentlyUpdated(count = 6) {
  return defaultSource.recentlyUpdated(count);
}

export async function getEditorPicks(count = 4) {
  return defaultSource.editorPicks(count);
}

export async function getAdjacentChapterPosts(post: Post) {
  return defaultSource.adjacentChapters(post);
}
