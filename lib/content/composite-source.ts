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
 * Composite source — source of truth by post origin.
 *
 * - Posts created via /admin are stored in the DB with source = "DB". These
 *   win over any MDX file with the same slug.
 * - Posts imported from MDX are stored in the DB with source = "IMPORTED".
 *   The MDX file wins so edits to the file are reflected immediately.
 * - Pure MDX posts (source = "FILE") are used as-is.
 * - If the DB is unreachable, all queries fall back to the filesystem so
 *   builds keep working.
 */

export class CompositeSource implements PostSource {
  constructor(
    private readonly db: PostSource = new PrismaPostSource(),
    private readonly fs: PostSource = new MdxFileSource()
  ) {}

  // ---- Per-slug (admin DB wins, then MDX, then imported DB) ---------------

  async get(
    slug: string,
    opts?: { includeUnpublished?: boolean }
  ): Promise<NormalizedPost | null> {
    const [dbPost, fsPost] = await Promise.all([
      safeDbCall(() => this.db.get(slug, opts)),
      this.fs.get(slug, opts),
    ]);
    if (dbPost?.source === "DB") return dbPost;
    if (fsPost) return fsPost;
    return dbPost ?? null;
  }

  async has(
    slug: string,
    opts?: { includeUnpublished?: boolean }
  ): Promise<boolean> {
    const [dbHas, fsHas] = await Promise.all([
      safeDbCall(() => this.db.has(slug, opts)),
      this.fs.has(slug, opts),
    ]);
    return fsHas || !!dbHas;
  }

  // ---- Listings: admin DB wins, MDX wins over imported DB -----------------

  async list(opts?: ListOptions): Promise<NormalizedPostSummary[]> {
    const [fsPosts, dbPosts] = await Promise.all([
      this.fs.list(opts),
      safeDbCall(() => this.db.list(opts)),
    ]);
    return mergeSources(fsPosts, dbPosts, sortByDate);
  }

  async byCategory(
    slug: string,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const [fsPosts, dbPosts] = await Promise.all([
      this.fs.byCategory(slug, opts),
      safeDbCall(() => this.db.byCategory(slug, opts)),
    ]);
    return mergeSources(fsPosts, dbPosts, (items) =>
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
    const [fsPosts, dbPosts] = await Promise.all([
      this.fs.byTag(slug, opts),
      safeDbCall(() => this.db.byTag(slug, opts)),
    ]);
    return mergeSources(fsPosts, dbPosts, sortByDate);
  }

  async byYear(
    year: string,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const [fsPosts, dbPosts] = await Promise.all([
      this.fs.byYear(year, opts),
      safeDbCall(() => this.db.byYear(year, opts)),
    ]);
    return mergeSources(fsPosts, dbPosts, sortByDate);
  }

  // ---- Aggregations: combine FS and DB counts -----------------------------

  async categories(opts?: ListOptions): Promise<NormalizedCategory[]> {
    const [fsCats, dbCats] = await Promise.all([
      this.fs.categories(opts),
      safeDbCall(() => this.db.categories(opts)),
    ]);
    return mergeCategoryCounts(fsCats, dbCats);
  }

  async tags(opts?: ListOptions): Promise<NormalizedTag[]> {
    const [fsTags, dbTags] = await Promise.all([
      this.fs.tags(opts),
      safeDbCall(() => this.db.tags(opts)),
    ]);
    return mergeTagCounts(fsTags, dbTags);
  }

  async archiveYears(opts?: ListOptions): Promise<NormalizedArchiveYear[]> {
    const [fsYears, dbYears] = await Promise.all([
      this.fs.archiveYears(opts),
      safeDbCall(() => this.db.archiveYears(opts)),
    ]);
    return mergeYearCounts(fsYears, dbYears);
  }

  // ---- Relations: prefer source of current post ---------------------------

  async related(
    post: NormalizedPost,
    count = 3
  ): Promise<NormalizedPostSummary[]> {
    const [fsRelated, dbRelated] = await Promise.all([
      this.fs.related(post, count),
      safeDbCall(() => this.db.related(post, count)),
    ]);
    return mergeSources(fsRelated, dbRelated ?? [], (items) =>
      [...items].slice(0, count)
    );
  }

  async prevNext(post: NormalizedPost): Promise<AdjacentPosts> {
    const [fsAdjacent, dbAdjacent] = await Promise.all([
      this.fs.prevNext(post),
      safeDbCall(() => this.db.prevNext(post)),
    ]);
    return {
      prev: fsAdjacent.prev ?? dbAdjacent?.prev ?? null,
      next: fsAdjacent.next ?? dbAdjacent?.next ?? null,
    };
  }

  async adjacentChapters(post: NormalizedPost): Promise<AdjacentPosts> {
    const [fsAdjacent, dbAdjacent] = await Promise.all([
      this.fs.adjacentChapters(post),
      safeDbCall(() => this.db.adjacentChapters(post)),
    ]);
    return {
      prev: fsAdjacent.prev ?? dbAdjacent?.prev ?? null,
      next: fsAdjacent.next ?? dbAdjacent?.next ?? null,
    };
  }

  // ---- Featured / curated: admin DB wins, then MDX, then imported DB ------

  async featured(opts?: ListOptions): Promise<NormalizedPostSummary | null> {
    const [fsFeatured, dbFeatured] = await Promise.all([
      this.fs.featured(opts),
      safeDbCall(() => this.db.featured(opts)),
    ]);
    if (dbFeatured?.source === "DB") return dbFeatured;
    return fsFeatured ?? dbFeatured ?? null;
  }

  async popular(
    count = 6,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const [fs, db] = await Promise.all([
      this.fs.popular(count, opts),
      safeDbCall(() => this.db.popular(count, opts)),
    ]);
    return mergeSources(fs, db ?? [], (items) =>
      sortByDate(items).slice(0, count)
    );
  }

  async recentlyUpdated(
    count = 6,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const [fs, db] = await Promise.all([
      this.fs.recentlyUpdated(count, opts),
      safeDbCall(() => this.db.recentlyUpdated(count, opts)),
    ]);
    return mergeSources(fs, db ?? [], (items) =>
      sortByDate(items).slice(0, count)
    );
  }

  async editorPicks(
    count = 4,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const [fs, db] = await Promise.all([
      this.fs.editorPicks(count, opts),
      safeDbCall(() => this.db.editorPicks(count, opts)),
    ]);
    return mergeSources(fs, db ?? [], (items) =>
      sortByDate(items).slice(0, count)
    );
  }

  async latest(
    count = 6,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const [fs, db] = await Promise.all([
      this.fs.latest(count, opts),
      safeDbCall(() => this.db.latest(count, opts)),
    ]);
    return mergeSources(fs, db ?? [], (items) =>
      sortByDate(items).slice(0, count)
    );
  }

  async invalidate(slug?: string): Promise<void> {
    await Promise.all([
      this.fs.invalidate(slug).catch(() => {}),
      this.db.invalidate(slug).catch(() => {}),
    ]);
  }
}

async function safeDbCall<T>(fn: () => Promise<T>): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    console.warn("DB query failed, falling back to filesystem:", error);
    return undefined;
  }
}

function mergeSources<T extends NormalizedPostSummary>(
  fs: T[],
  db: T[] | undefined,
  finalize: (items: Iterable<T>) => T[]
): T[] {
  const map = new Map<string, T>();
  for (const p of fs) map.set(p.slug, p); // MDX first
  if (db) {
    for (const p of db) {
      // Admin-created DB posts override MDX; imported DB posts fill gaps.
      if (p.source === "DB" || !map.has(p.slug)) {
        map.set(p.slug, p);
      }
    }
  }
  return finalize(map.values());
}

function mergeCategoryCounts(
  fs: NormalizedCategory[],
  db: NormalizedCategory[] | undefined
): NormalizedCategory[] {
  const map = new Map<string, NormalizedCategory>();
  for (const c of fs) map.set(c.slug, { ...c, count: 0 });
  if (db) {
    for (const c of db) {
      const existing = map.get(c.slug);
      if (existing) existing.count += c.count;
      else map.set(c.slug, { ...c });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

function mergeTagCounts(
  fs: NormalizedTag[],
  db: NormalizedTag[] | undefined
): NormalizedTag[] {
  const map = new Map<string, NormalizedTag>();
  for (const t of fs) map.set(t.slug, { ...t, count: 0 });
  if (db) {
    for (const t of db) {
      const existing = map.get(t.slug);
      if (existing) existing.count += t.count;
      else map.set(t.slug, { ...t });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

function mergeYearCounts(
  fs: NormalizedArchiveYear[],
  db: NormalizedArchiveYear[] | undefined
): NormalizedArchiveYear[] {
  const map = new Map<string, number>();
  for (const y of fs) map.set(y.year, 0);
  if (db) {
    for (const y of db) map.set(y.year, (map.get(y.year) ?? 0) + y.count);
  }
  return [...map.entries()]
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year.localeCompare(a.year));
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
