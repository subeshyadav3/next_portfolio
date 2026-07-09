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

  async has(slug: string, opts?: { includeUnpublished?: boolean }): Promise<boolean> {
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
    const map = new Map<string, NormalizedPostSummary>();
    for (const p of dbPosts) map.set(p.slug, p); // DB wins on collision
    for (const p of fsPosts) if (!map.has(p.slug)) map.set(p.slug, p);
    return [...map.values()].sort(
      (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
    );
  }

  async byCategory(
    slug: string,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const [dbPosts, fsPosts] = await Promise.all([
      this.db.byCategory(slug, opts),
      this.fs.byCategory(slug, opts),
    ]);
    const map = new Map<string, NormalizedPostSummary>();
    for (const p of dbPosts) map.set(p.slug, p);
    for (const p of fsPosts) if (!map.has(p.slug)) map.set(p.slug, p);
    return [...map.values()].sort(
      (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
    );
  }

  async byTag(slug: string, opts?: ListOptions): Promise<NormalizedPostSummary[]> {
    const [dbPosts, fsPosts] = await Promise.all([
      this.db.byTag(slug, opts),
      this.fs.byTag(slug, opts),
    ]);
    const map = new Map<string, NormalizedPostSummary>();
    for (const p of dbPosts) map.set(p.slug, p);
    for (const p of fsPosts) if (!map.has(p.slug)) map.set(p.slug, p);
    return [...map.values()].sort(
      (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
    );
  }

  async byYear(year: string, opts?: ListOptions): Promise<NormalizedPostSummary[]> {
    const [dbPosts, fsPosts] = await Promise.all([
      this.db.byYear(year, opts),
      this.fs.byYear(year, opts),
    ]);
    const map = new Map<string, NormalizedPostSummary>();
    for (const p of dbPosts) map.set(p.slug, p);
    for (const p of fsPosts) if (!map.has(p.slug)) map.set(p.slug, p);
    return [...map.values()].sort(
      (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
    );
  }

  // ---- Aggregations: union ------------------------------------------------

  async categories(): Promise<NormalizedCategory[]> {
    const [dbCats, fsCats] = await Promise.all([
      this.db.categories(),
      this.fs.categories(),
    ]);
    const map = new Map<string, NormalizedCategory>();
    for (const c of dbCats) map.set(c.slug, { ...c, count: 0 }); // counts filled below
    for (const c of fsCats) {
      const existing = map.get(c.slug);
      if (existing) existing.count += c.count;
      else map.set(c.slug, { ...c });
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  }

  async tags(): Promise<NormalizedTag[]> {
    const [dbTags, fsTags] = await Promise.all([
      this.db.tags(),
      this.fs.tags(),
    ]);
    const map = new Map<string, NormalizedTag>();
    for (const t of dbTags) map.set(t.slug, { ...t, count: 0 });
    for (const t of fsTags) {
      const existing = map.get(t.slug);
      if (existing) existing.count += t.count;
      else map.set(t.slug, { ...t });
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  }

  async archiveYears(): Promise<NormalizedArchiveYear[]> {
    const [dbYears, fsYears] = await Promise.all([
      this.db.archiveYears(),
      this.fs.archiveYears(),
    ]);
    const map = new Map<string, number>();
    for (const y of dbYears) map.set(y.year, 0);
    for (const y of fsYears) map.set(y.year, (map.get(y.year) ?? 0) + y.count);
    return [...map.entries()]
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => b.year.localeCompare(a.year));
  }

  // ---- Relations: delegate to FS for legacy, DB for new -------------------

  async related(post: NormalizedPost, count = 3): Promise<NormalizedPostSummary[]> {
    if (post.source === "DB") return this.db.related(post, count);
    const [dbRelated, fsRelated] = await Promise.all([
      this.db.related(post, count),
      this.fs.related(post, count),
    ]);
    const map = new Map<string, NormalizedPostSummary>();
    for (const p of dbRelated) map.set(p.slug, p);
    for (const p of fsRelated) if (!map.has(p.slug)) map.set(p.slug, p);
    return [...map.values()].slice(0, count);
  }

  async prevNext(post: NormalizedPost): Promise<AdjacentPosts> {
    // For DB posts, use DB prev/next; otherwise use FS.
    if (post.source === "DB") return this.db.prevNext(post);
    return this.fs.prevNext(post);
  }

  async adjacentChapters(post: NormalizedPost): Promise<AdjacentPosts> {
    if (post.source === "DB") return this.db.adjacentChapters(post);
    return this.fs.adjacentChapters(post);
  }

  // ---- Featured / curated: prefer DB, fall back to FS ---------------------

  async featured(): Promise<NormalizedPostSummary | null> {
    const fromDb = await this.db.featured();
    if (fromDb) return fromDb;
    return this.fs.featured();
  }

  async popular(count = 6): Promise<NormalizedPostSummary[]> {
    const [db, fs] = await Promise.all([
      this.db.popular(count),
      this.fs.popular(count),
    ]);
    return mergeLists(db, fs, count);
  }

  async recentlyUpdated(count = 6): Promise<NormalizedPostSummary[]> {
    const [db, fs] = await Promise.all([
      this.db.recentlyUpdated(count),
      this.fs.recentlyUpdated(count),
    ]);
    return mergeLists(db, fs, count);
  }

  async editorPicks(count = 4): Promise<NormalizedPostSummary[]> {
    const [db, fs] = await Promise.all([
      this.db.editorPicks(count),
      this.fs.editorPicks(count),
    ]);
    return mergeLists(db, fs, count);
  }

  async latest(count = 6): Promise<NormalizedPostSummary[]> {
    const [db, fs] = await Promise.all([
      this.db.latest(count),
      this.fs.latest(count),
    ]);
    return mergeLists(db, fs, count);
  }

  async invalidate(slug?: string): Promise<void> {
    await Promise.all([this.db.invalidate(slug), this.fs.invalidate(slug)]);
  }
}

function mergeLists(
  a: NormalizedPostSummary[],
  b: NormalizedPostSummary[],
  limit: number
): NormalizedPostSummary[] {
  const map = new Map<string, NormalizedPostSummary>();
  for (const p of a) map.set(p.slug, p);
  for (const p of b) if (!map.has(p.slug)) map.set(p.slug, p);
  return [...map.values()]
    .sort(
      (x, y) =>
        new Date(y.published).getTime() - new Date(x.published).getTime()
    )
    .slice(0, limit);
}
