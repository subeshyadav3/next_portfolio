/**
 * Content layer — shared types.
 *
 * `NormalizedPost` is the shape every PostSource returns. It is the union of
 * legacy MDX frontmatter and DB columns. Existing components consume this
 * shape so the abstraction is invisible to callers.
 *
 * `NormalizedPostSummary` is the same shape minus `content` for listings.
 * Sources can implement it efficiently by not loading the body.
 */

export type PostLanguage = "en" | "ne";

export interface NormalizedPost {
  slug: string;
  title: string;
  description: string;
  /** MDX body — never loaded for listings. */
  content: string;
  published: string; // ISO
  updated: string; // ISO
  category: string;
  tags: string[];
  author: string;
  authorSlug: string;
  authorUrl: string;
  image: string;
  readingTime: number;
  featured: boolean;
  language: PostLanguage;

  // Optional educational metadata (only present for DB posts)
  classLevel?: string | null;
  subject?: string | null;
  board?: string | null;
  difficulty?: "EASY" | "MEDIUM" | "HARD" | null;
  examType?: "SEE" | "BLE" | "NEB" | "IOE" | "CEEC" | "OTHER" | null;
  series?: string | null;

  // Provenance — "FILE" for legacy MDX, "DB" for new posts
  source: "FILE" | "DB" | "IMPORTED";
}

export type NormalizedPostSummary = Omit<NormalizedPost, "content">;

export interface NormalizedCategory {
  name: string;
  slug: string;
  count: number;
}

export interface NormalizedTag {
  name: string;
  slug: string;
  count: number;
  description?: string | null;
}

export interface NormalizedArchiveYear {
  year: string;
  count: number;
}

export interface ListOptions {
  /** Maximum number of posts to return. */
  limit?: number;
  /** Skip count, for pagination. */
  offset?: number;
  /** Include drafts/scheduled. Default false (public listing). */
  includeUnpublished?: boolean;
  /** Filter by language. Default none (all languages). */
  language?: PostLanguage;
}

export interface AdjacentPosts {
  prev: NormalizedPost | null;
  next: NormalizedPost | null;
}
