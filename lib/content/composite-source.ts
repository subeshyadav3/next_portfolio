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
import { MdxFileSource } from "./mdx-file-source";
import { PrismaPostSource } from "./prisma-post-source";

/**
 * Composite source — checks DB first, falls back to filesystem.
 *
 * Listing/aggregation methods prefer the DB when it has *any* posts,
 * otherwise fall back to filesystem so the existing site keeps working
 * during the transition period.
 *
 * Single-post reads do DB-first then FS-fallback per slug so a DB post
 * and a legacy MDX post can co-exist without collision.
 *
 * Once you migrate all legacy posts into the DB (optional, via the
 * `import:mdx` script), you can delete the `MdxFileSource` fallback.
 */

/** Force FS fallback even when the DB has data (legacy/local dev mode). */
const FORCE_FS_FALLBACK = process.env.FORCE_FS_FALLBACK === "true";

export class CompositeSource implements PostSource {
  constructor(
    private readonly db: PostSource = new PrismaPostSource(),
    private readonly fs: PostSource = new MdxFileSource()
  ) {}

  // ---- Per-slug (DB first, FS fallback) -----------------------------------

  async get(
    slug: string,
    opts?: { includeUnpublished?: boolean }
  ): Promise<NormalizedPost | null> {
    const fromDb = await this.db.get(slug, opts);
    if (fromDb) return fromDb;
    return this.fs.get(slug, opts);
  }

  async has(
    slug: string,
    opts?: { includeUnpublished?: boolean }
  ): Promise<boolean> {
    const dbHas = await this.db.has(slug, opts);
    if (dbHas) return true;
    return this.fs.has(slug, opts);
  }

  // ---- Listings: DB-first, FS fallback only when DB empty -----------------

  async list(opts?: ListOptions): Promise<NormalizedPostSummary[]> {
    const dbPosts = await this.db.list(opts);
    if (dbPosts.length > 0 && !FORCE_FS_FALLBACK) return sortByDate(dbPosts);
    const fsPosts = await this.fs.list(opts);
    return mergeUnique(dbPosts, fsPosts, sortByDate);
  }

  async byCategory(
    slug: string,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const dbPosts = await this.db.byCategory(slug, opts);
    if (dbPosts.length > 0 && !FORCE_FS_FALLBACK) return dbPosts;
    const fsPosts = await this.fs.byCategory(slug, opts);
    return mergeUnique(dbPosts, fsPosts, (items) =>
      [...items].sort(
        (a, b) =>
          new Date(b.published).getTime() - new Date(a.published).getTime()
      )
    );
  }

  async byTag(
    slug: string,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const dbPosts = await this.db.byTag(slug, opts);
    if (dbPosts.length > 0 && !FORCE_FS_FALLBACK) return sortByDate(dbPosts);
    const fsPosts = await this.fs.byTag(slug, opts);
    return mergeUnique(dbPosts, fsPosts, sortByDate);
  }

  async byYear(
    year: string,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const dbPosts = await this.db.byYear(year, opts);
    if (dbPosts.length > 0 && !FORCE_FS_FALLBACK) return sortByDate(dbPosts);
    const fsPosts = await this.fs.byYear(year, opts);
    return mergeUnique(dbPosts, fsPosts, sortByDate);
  }

  // ---- Aggregations: DB-first, FS fallback only when DB empty -------------

  async categories(opts?: ListOptions): Promise<NormalizedCategory[]> {
    const dbCats = await this.db.categories(opts);
    if (dbCats.length > 0 && !FORCE_FS_FALLBACK) return dbCats;
    const fsCats = await this.fs.categories(opts);
    return mergeCategoryCounts(dbCats, fsCats);
  }

  async tags(opts?: ListOptions): Promise<NormalizedTag[]> {
    const dbTags = await this.db.tags(opts);
    if (dbTags.length > 0 && !FORCE_FS_FALLBACK) return dbTags;
    const fsTags = await this.fs.tags(opts);
    return mergeTagCounts(dbTags, fsTags);
  }

  async archiveYears(opts?: ListOptions): Promise<NormalizedArchiveYear[]> {
    const dbYears = await this.db.archiveYears(opts);
    if (dbYears.length > 0 && !FORCE_FS_FALLBACK) return dbYears;
    const fsYears = await this.fs.archiveYears(opts);
    return mergeYearCounts(dbYears, fsYears);
  }

  // ---- Relations: delegate to source, with DB fallback for FS posts -------

  async related(
    post: NormalizedPost,
    count = 3
  ): Promise<NormalizedPostSummary[]> {
    if (post.source === "DB") return this.db.related(post, count);
    const dbRelated = await this.db.related(post, count);
    if (dbRelated.length >= count && !FORCE_FS_FALLBACK) return dbRelated;
    const fsRelated = await this.fs.related(post, count);
    return mergeUnique(dbRelated, fsRelated, (items) =>
      [...items].slice(0, count)
    );
  }

  async prevNext(post: NormalizedPost): Promise<AdjacentPosts> {
    if (post.source === "DB") return this.db.prevNext(post);
    const dbAdjacent = await this.db.prevNext(post);
    if ((dbAdjacent.prev || dbAdjacent.next) && !FORCE_FS_FALLBACK)
      return dbAdjacent;
    return this.fs.prevNext(post);
  }

  async adjacentChapters(post: NormalizedPost): Promise<AdjacentPosts> {
    if (post.source === "DB") return this.db.adjacentChapters(post);
    const dbAdjacent = await this.db.adjacentChapters(post);
    if ((dbAdjacent.prev || dbAdjacent.next) && !FORCE_FS_FALLBACK)
      return dbAdjacent;
    return this.fs.adjacentChapters(post);
  }

  // ---- Featured / curated: DB-first, FS fallback only when DB empty -------

  async featured(opts?: ListOptions): Promise<NormalizedPostSummary | null> {
    const fromDb = await this.db.featured(opts);
    if (fromDb) return fromDb;
    return this.fs.featured(opts);
  }

  async popular(
    count = 6,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const db = await this.db.popular(count, opts);
    if (db.length > 0 && !FORCE_FS_FALLBACK) return db;
    const fs = await this.fs.popular(count, opts);
    return mergeLists(db, fs, count);
  }

  async recentlyUpdated(
    count = 6,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const db = await this.db.recentlyUpdated(count, opts);
    if (db.length > 0 && !FORCE_FS_FALLBACK) return db;
    const fs = await this.fs.recentlyUpdated(count, opts);
    return mergeLists(db, fs, count);
  }

  async editorPicks(
    count = 4,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const db = await this.db.editorPicks(count, opts);
    if (db.length > 0 && !FORCE_FS_FALLBACK) return db;
    const fs = await this.fs.editorPicks(count, opts);
    return mergeLists(db, fs, count);
  }

  async latest(
    count = 6,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const db = await this.db.latest(count, opts);
    if (db.length > 0 && !FORCE_FS_FALLBACK) return db;
    const fs = await this.fs.latest(count, opts);
    return mergeLists(db, fs, count);
  }

  async invalidate(slug?: string): Promise<void> {
    await Promise.all([this.db.invalidate(slug), this.fs.invalidate(slug)]);
  }
}

function mergeUnique<T extends NormalizedPostSummary>(
  db: T[],
  fs: T[],
  finalize: (items: Iterable<T>) => T[]
): T[] {
  const map = new Map<string, T>();
  for (const p of db) map.set(p.slug, p);
  for (const p of fs) if (!map.has(p.slug)) map.set(p.slug, p);
  return finalize(map.values());
}

function mergeCategoryCounts(
  db: NormalizedCategory[],
  fs: NormalizedCategory[]
): NormalizedCategory[] {
  const map = new Map<string, NormalizedCategory>();
  for (const c of db) map.set(c.slug, { ...c, count: 0 });
  for (const c of fs) {
    const existing = map.get(c.slug);
    if (existing) existing.count += c.count;
    else map.set(c.slug, { ...c });
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

function mergeTagCounts(db: NormalizedTag[], fs: NormalizedTag[]): NormalizedTag[] {
  const map = new Map<string, NormalizedTag>();
  for (const t of db) map.set(t.slug, { ...t, count: 0 });
  for (const t of fs) {
    const existing = map.get(t.slug);
    if (existing) existing.count += t.count;
    else map.set(t.slug, { ...t });
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

function mergeYearCounts(
  db: NormalizedArchiveYear[],
  fs: NormalizedArchiveYear[]
): NormalizedArchiveYear[] {
  const map = new Map<string, number>();
  for (const y of db) map.set(y.year, 0);
  for (const y of fs) map.set(y.year, (map.get(y.year) ?? 0) + y.count);
  return [...map.entries()]
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year.localeCompare(a.year));
}

function mergeLists(
  a: NormalizedPostSummary[],
  b: NormalizedPostSummary[],
  limit: number
): NormalizedPostSummary[] {
  return mergeUnique(a, b, (items) => sortByDate(items).slice(0, limit));
}

function safeDate(s: string | undefined): number {
  const d = new Date(s ?? "");
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

function sortByDate<T extends { published: string }>(items: Iterable<T>): T[] {
  return [...items].sort((a, b) => safeDate(b.published) - safeDate(a.published));
}
