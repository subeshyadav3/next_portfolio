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
 * Composite source — unions DB posts and MDX file posts.
 *
 * Both sources are queried and merged so that legacy MDX files keep
 * appearing even after DB posts exist. The individual sources are
 * cached (Prisma via unstable_cache, MDX via unstable_cache), so the
 * double read is cheap in production.
 */
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

  // ---- Listings: union of DB + FS -----------------------------------------

  async list(opts?: ListOptions): Promise<NormalizedPostSummary[]> {
    const [dbPosts, fsPosts] = await Promise.all([
      this.db.list(opts),
      this.fs.list(opts),
    ]);
    return mergeUnique(dbPosts, fsPosts, sortByDate);
  }

  async byCategory(
    slug: string,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const [dbPosts, fsPosts] = await Promise.all([
      this.db.byCategory(slug, opts),
      this.fs.byCategory(slug, opts),
    ]);
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
    const [dbPosts, fsPosts] = await Promise.all([
      this.db.byTag(slug, opts),
      this.fs.byTag(slug, opts),
    ]);
    return mergeUnique(dbPosts, fsPosts, sortByDate);
  }

  async byYear(
    year: string,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const [dbPosts, fsPosts] = await Promise.all([
      this.db.byYear(year, opts),
      this.fs.byYear(year, opts),
    ]);
    return mergeUnique(dbPosts, fsPosts, sortByDate);
  }

  // ---- Aggregations: union ------------------------------------------------

  async categories(opts?: ListOptions): Promise<NormalizedCategory[]> {
    const [dbCats, fsCats] = await Promise.all([
      this.db.categories(opts),
      this.fs.categories(opts),
    ]);
    return mergeCategoryCounts(dbCats, fsCats);
  }

  async tags(opts?: ListOptions): Promise<NormalizedTag[]> {
    const [dbTags, fsTags] = await Promise.all([
      this.db.tags(opts),
      this.fs.tags(opts),
    ]);
    return mergeTagCounts(dbTags, fsTags);
  }

  async archiveYears(opts?: ListOptions): Promise<NormalizedArchiveYear[]> {
    const [dbYears, fsYears] = await Promise.all([
      this.db.archiveYears(opts),
      this.fs.archiveYears(opts),
    ]);
    return mergeYearCounts(dbYears, fsYears);
  }

  // ---- Relations: prefer source of current post ---------------------------

  async related(
    post: NormalizedPost,
    count = 3
  ): Promise<NormalizedPostSummary[]> {
    if (post.source === "DB") return this.db.related(post, count);
    const [dbRelated, fsRelated] = await Promise.all([
      this.db.related(post, count),
      this.fs.related(post, count),
    ]);
    return mergeUnique(dbRelated, fsRelated, (items) =>
      [...items].slice(0, count)
    );
  }

  async prevNext(post: NormalizedPost): Promise<AdjacentPosts> {
    if (post.source === "DB") return this.db.prevNext(post);
    const [dbAdjacent, fsAdjacent] = await Promise.all([
      this.db.prevNext(post),
      this.fs.prevNext(post),
    ]);
    return {
      prev: dbAdjacent.prev ?? fsAdjacent.prev ?? null,
      next: dbAdjacent.next ?? fsAdjacent.next ?? null,
    };
  }

  async adjacentChapters(post: NormalizedPost): Promise<AdjacentPosts> {
    if (post.source === "DB") return this.db.adjacentChapters(post);
    const [dbAdjacent, fsAdjacent] = await Promise.all([
      this.db.adjacentChapters(post),
      this.fs.adjacentChapters(post),
    ]);
    return {
      prev: dbAdjacent.prev ?? fsAdjacent.prev ?? null,
      next: dbAdjacent.next ?? fsAdjacent.next ?? null,
    };
  }

  // ---- Featured / curated: union ------------------------------------------

  async featured(opts?: ListOptions): Promise<NormalizedPostSummary | null> {
    const fromDb = await this.db.featured(opts);
    if (fromDb) return fromDb;
    return this.fs.featured(opts);
  }

  async popular(
    count = 6,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const [db, fs] = await Promise.all([
      this.db.popular(count, opts),
      this.fs.popular(count, opts),
    ]);
    return mergeLists(db, fs, count);
  }

  async recentlyUpdated(
    count = 6,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const [db, fs] = await Promise.all([
      this.db.recentlyUpdated(count, opts),
      this.fs.recentlyUpdated(count, opts),
    ]);
    return mergeLists(db, fs, count);
  }

  async editorPicks(
    count = 4,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const [db, fs] = await Promise.all([
      this.db.editorPicks(count, opts),
      this.fs.editorPicks(count, opts),
    ]);
    return mergeLists(db, fs, count);
  }

  async latest(
    count = 6,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const [db, fs] = await Promise.all([
      this.db.latest(count, opts),
      this.fs.latest(count, opts),
    ]);
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

function mergeTagCounts(
  db: NormalizedTag[],
  fs: NormalizedTag[]
): NormalizedTag[] {
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

function sortByDate<T extends { published: string }>(
  items: Iterable<T>
): T[] {
  return [...items].sort((a, b) => safeDate(b.published) - safeDate(a.published));
}
