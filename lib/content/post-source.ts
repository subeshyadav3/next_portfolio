import type {
  AdjacentPosts,
  ListOptions,
  NormalizedArchiveYear,
  NormalizedCategory,
  NormalizedPost,
  NormalizedPostSummary,
  NormalizedTag,
} from "./types";

/**
 * A PostSource provides read access to blog posts. There are two concrete
 * implementations:
 *   - `MdxFileSource` reads `final_content/blog/*.mdx` (legacy content).
 *   - `PrismaPostSource` reads the `Post` table (new content).
 *
 * The default app source is `CompositeSource` which prefers DB and falls
 * back to filesystem for missing slugs.
 */
export interface PostSource {
  // ---- Reads ----

  /** All posts (or summaries), newest first. */
  list(opts?: ListOptions): Promise<NormalizedPostSummary[]>;

  /** Full post with body, or null if not found. */
  get(slug: string, opts?: { includeUnpublished?: boolean }): Promise<NormalizedPost | null>;

  /** True if a post with this slug exists in this source. */
  has(slug: string, opts?: { includeUnpublished?: boolean }): Promise<boolean>;

  byCategory(
    slug: string,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]>;

  byTag(slug: string, opts?: ListOptions): Promise<NormalizedPostSummary[]>;

  byYear(year: string, opts?: ListOptions): Promise<NormalizedPostSummary[]>;

  // ---- Aggregations ----

  categories(opts?: ListOptions): Promise<NormalizedCategory[]>;
  tags(opts?: ListOptions): Promise<NormalizedTag[]>;
  archiveYears(opts?: ListOptions): Promise<NormalizedArchiveYear[]>;

  // ---- Relations ----

  related(post: NormalizedPost, count?: number): Promise<NormalizedPostSummary[]>;

  prevNext(post: NormalizedPost): Promise<AdjacentPosts>;

  /** Exam-category chapter-aware prev/next (uses title/slug lesson numbers). */
  adjacentChapters(post: NormalizedPost): Promise<AdjacentPosts>;

  // ---- Featured / curated ----

  featured(opts?: ListOptions): Promise<NormalizedPostSummary | null>;
  popular(count?: number, opts?: ListOptions): Promise<NormalizedPostSummary[]>;
  recentlyUpdated(count?: number, opts?: ListOptions): Promise<NormalizedPostSummary[]>;
  editorPicks(count?: number, opts?: ListOptions): Promise<NormalizedPostSummary[]>;
  latest(count?: number, opts?: ListOptions): Promise<NormalizedPostSummary[]>;

  // ---- Maintenance ----

  /** Drop any cached state. Used after admin writes. */
  invalidate(slug?: string): Promise<void>;
}
