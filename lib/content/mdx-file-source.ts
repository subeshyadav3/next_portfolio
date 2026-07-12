import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unstable_cache } from "next/cache";
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
import {
  getCategorySlug,
  getCategoryLabel,
  isNepaliLanguageCategory,
} from "@/lib/blog/categories";
import { getYear } from "@/lib/blog/utils";

const POSTS_DIR = path.join(process.cwd(), "final_content", "blog");

/* -------------------------------------------------------------------------- */
/*  Internal helpers                                                          */
/* -------------------------------------------------------------------------- */

function readPostFile(filePath: string): NormalizedPost | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    const language = data.language
      ? data.language
      : isNepaliLanguageCategory(data.category)
        ? "ne"
        : "en";

    const category = data.category ?? "uncategorized";

    return {
      slug: data.slug,
      title: data.title,
      description: data.description ?? "",
      content,
      published: data.published,
      updated: data.updated ?? data.published,
      category,
      tags: data.tags ?? [],
      author: data.author ?? "Subesh Yadav",
      authorSlug: "subesh-yadav",
      authorUrl: "/blog/author/subesh-yadav",
      image: data.image ?? "",
      readingTime: data.readingTime ?? 0,
      featured: data.featured ?? false,
      language,
      source: "FILE",
    };
  } catch (error) {
    console.error(`Failed to read post ${filePath}:`, error);
    return null;
  }
}

function readAllFromDisk(): NormalizedPost[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));

  return files
    .map((file) => readPostFile(path.join(POSTS_DIR, file)))
    .filter((p): p is NormalizedPost => p !== null)
    .sort(
      (a, b) =>
        new Date(b.published).getTime() - new Date(a.published).getTime()
    );
}

function summarize(p: NormalizedPost): NormalizedPostSummary {
  // Strip content for listings — saves memory at 5k posts.
  const { content, ...summary } = p;
  return summary;
}

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
/*  Cached disk reads                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Read all posts once per cache lifetime.
 *
 * `unstable_cache` caches the result across requests on the server, scoped
 * to a tag we can invalidate from admin actions.
 */
const getAllCached = unstable_cache(
  async (): Promise<NormalizedPost[]> => readAllFromDisk(),
  ["mdx-file-source:all"],
  { revalidate: 3600, tags: ["posts:mdx"] }
);

/* -------------------------------------------------------------------------- */
/*  Source implementation                                                     */
/* -------------------------------------------------------------------------- */

export class MdxFileSource implements PostSource {
  private filterLang(posts: NormalizedPost[], opts?: ListOptions): NormalizedPost[] {
    return opts?.language ? posts.filter((p) => p.language === opts.language) : posts;
  }

  async list(opts?: ListOptions): Promise<NormalizedPostSummary[]> {
    const all = await getAllCached();
    return paginate(this.filterLang(all, opts).map(summarize), opts);
  }

  async get(
    slug: string,
    opts?: { includeUnpublished?: boolean }
  ): Promise<NormalizedPost | null> {
    const all = await getAllCached();
    return all.find((p) => p.slug === slug) ?? null;
  }

  async has(slug: string): Promise<boolean> {
    const all = await getAllCached();
    return all.some((p) => p.slug === slug);
  }

  async byCategory(
    slug: string,
    opts?: ListOptions
  ): Promise<NormalizedPostSummary[]> {
    const all = await getAllCached();
    return paginate(
      this.filterLang(all, opts).filter((p) => getCategorySlug(p.category) === slug).map(summarize),
      opts
    );
  }

  async byTag(slug: string, opts?: ListOptions): Promise<NormalizedPostSummary[]> {
    const all = await getAllCached();
    return paginate(
      this.filterLang(all, opts).filter((p) => p.tags.some((t) => tagSlug(t) === tagSlug(slug))).map(summarize),
      opts
    );
  }

  async byYear(year: string, opts?: ListOptions): Promise<NormalizedPostSummary[]> {
    const all = await getAllCached();
    return paginate(
      this.filterLang(all, opts).filter((p) => getYear(p.published) === year).map(summarize),
      opts
    );
  }

  async categories(opts?: ListOptions): Promise<NormalizedCategory[]> {
    const all = this.filterLang(await getAllCached(), opts);
    const map = new Map<string, NormalizedCategory>();
    for (const p of all) {
      const slug = getCategorySlug(p.category);
      const existing = map.get(slug);
      if (existing) existing.count++;
      else map.set(slug, { name: getCategoryLabel(slug), slug, count: 1 });
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  }

  async tags(opts?: ListOptions): Promise<NormalizedTag[]> {
    const all = this.filterLang(await getAllCached(), opts);
    const map = new Map<string, NormalizedTag>();
    for (const p of all) {
      for (const tag of p.tags) {
        const slug = tagSlug(tag);
        const existing = map.get(slug);
        if (existing) existing.count++;
        else map.set(slug, { name: tag, slug, count: 1 });
      }
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  }

  async archiveYears(opts?: ListOptions): Promise<NormalizedArchiveYear[]> {
    const all = this.filterLang(await getAllCached(), opts);
    const map = new Map<string, number>();
    for (const p of all) {
      const y = getYear(p.published);
      if (y) map.set(y, (map.get(y) ?? 0) + 1);
    }
    return [...map.entries()]
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => b.year.localeCompare(a.year));
  }

  async related(post: NormalizedPost, count = 3): Promise<NormalizedPostSummary[]> {
    const all = (await getAllCached()).filter((p) => p.language === post.language);
    const scored = all
      .filter((p) => p.slug !== post.slug)
      .map((p) => {
        let score = 0;
        if (getCategorySlug(p.category) === getCategorySlug(post.category)) score += 5;
        score += p.tags.filter((t) => post.tags.includes(t)).length * 2;
        return { post: p, score };
      });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, count).map((s) => summarize(s.post));
  }

  async prevNext(post: NormalizedPost): Promise<AdjacentPosts> {
    const all = [...(await getAllCached())]
      .filter((p) => p.language === post.language)
      .sort(
      (a, b) =>
        new Date(a.published).getTime() - new Date(b.published).getTime()
    );
    const i = all.findIndex((p) => p.slug === post.slug);
    return {
      prev: i > 0 ? all[i - 1] : null,
      next: i < all.length - 1 ? all[i + 1] : null,
    };
  }

  async adjacentChapters(post: NormalizedPost): Promise<AdjacentPosts> {
    const current =
      chapterNumber(post.title) ?? chapterNumber(post.slug);
    if (current === null) return { prev: null, next: null };

    const all = (await getAllCached()).filter((p) => p.language === post.language);
    const numbered = all
      .filter(
        (p) =>
          p.slug !== post.slug &&
          getCategorySlug(p.category) === getCategorySlug(post.category)
      )
      .map((p) => ({
        post: p,
        number:
          chapterNumber(p.title) ?? chapterNumber(p.slug),
      }))
      .filter(
        (x): x is { post: NormalizedPost; number: number } =>
          x.number !== null
      )
      .sort((a, b) => a.number - b.number);

    const i = numbered.findIndex((x) => x.number === current);
    return {
      prev: i > 0 ? numbered[i - 1].post : null,
      next: i < numbered.length - 1 ? numbered[i + 1].post : null,
    };
  }

  async featured(opts?: ListOptions): Promise<NormalizedPostSummary | null> {
    const all = this.filterLang(await getAllCached(), opts);
    const f = all.find((p) => p.featured);
    return f ? summarize(f) : all[0] ? summarize(all[0]) : null;
  }

  async popular(count = 6, opts?: ListOptions): Promise<NormalizedPostSummary[]> {
    const all = this.filterLang(await getAllCached(), opts);
    return all
      .filter((p) => p.image && p.readingTime >= 3)
      .slice(0, count)
      .map(summarize);
  }

  async recentlyUpdated(count = 6, opts?: ListOptions): Promise<NormalizedPostSummary[]> {
    const all = this.filterLang(
      [...(await getAllCached())].sort(
        (a, b) =>
          new Date(b.updated).getTime() - new Date(a.updated).getTime()
      ),
      opts
    );
    return all.slice(0, count).map(summarize);
  }

  async editorPicks(count = 4, opts?: ListOptions): Promise<NormalizedPostSummary[]> {
    // Deterministic ordering by hashed index for stable SSR output.
    const all = this.filterLang(await getAllCached(), opts);
    return [...all]
      .sort((a, b) => {
        const ha = hashSlug(a.slug);
        const hb = hashSlug(b.slug);
        return ha - hb;
      })
      .slice(0, count)
      .map(summarize);
  }

  async latest(count = 6, opts?: ListOptions): Promise<NormalizedPostSummary[]> {
    const all = this.filterLang(await getAllCached(), opts);
    return all.slice(0, count).map(summarize);
  }

  async invalidate(slug?: string): Promise<void> {
    const { revalidateTag } = await import("next/cache");
    revalidateTag("posts:mdx");
  }
}

/** Deterministic FNV-1a-ish hash for stable shuffles. */
function hashSlug(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
