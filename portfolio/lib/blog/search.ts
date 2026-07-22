import Fuse, { FuseResult } from "fuse.js";
import type { NormalizedPost, NormalizedPostSummary } from "@/lib/content";

export interface SearchIndexItem {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  published: string;
  image: string;
  readingTime: number;
}

/** Build search index from either Post or PostSummary (content will be empty for summary). */
export function buildSearchIndex(
  posts: (NormalizedPost | (NormalizedPostSummary & { content?: string }))[]
): SearchIndexItem[] {
  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    content: (post.content ?? "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 2000),
    category: post.category,
    tags: post.tags,
    published: post.published,
    image: post.image,
    readingTime: post.readingTime,
  }));
}

export function createFuseIndex(items: SearchIndexItem[]) {
  return new Fuse(items, {
    keys: [
      { name: "title", weight: 0.4 },
      { name: "description", weight: 0.3 },
      { name: "content", weight: 0.2 },
      { name: "category", weight: 0.05 },
      { name: "tags", weight: 0.05 },
    ],
    threshold: 0.4,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
}

export function searchPosts(
  index: Fuse<SearchIndexItem>,
  query: string,
  category?: string,
  tag?: string
): FuseResult<SearchIndexItem>[] {
  let results = index.search(query);

  if (category) {
    results = results.filter(
      (result) =>
        result.item.category.toLowerCase() === decodeURIComponent(category).toLowerCase()
    );
  }

  if (tag) {
    const decodedTag = decodeURIComponent(tag).toLowerCase();
    results = results.filter((result) =>
      result.item.tags.some((t) => t.toLowerCase() === decodedTag)
    );
  }

  return results;
}
