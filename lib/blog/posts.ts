import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post, PostMeta, Category, Tag, ArchiveYear } from "./types";
import { tagSlug } from "./slugs";
import {
  getCategorySlug,
  getCategoryLabel,
  isNepaliLanguageCategory,
} from "./categories";
import { getYear } from "./utils";

const POSTS_DIR = path.join(process.cwd(), "content/blog");

function readPostFile(filePath: string): Post | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    const meta = data as PostMeta;
    if (!meta.language) {
      meta.language = isNepaliLanguageCategory(meta.category) ? "ne" : "en";
    }

    return {
      ...meta,
      content,
    } as Post;
  } catch (error) {
    console.error(`Failed to read post ${filePath}:`, error);
    return null;
  }
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));

  const posts = files
    .map((file) => readPostFile(path.join(POSTS_DIR, file)))
    .filter((post): post is Post => post !== null);

  return posts.sort(
    (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getPostsByCategory(slug: string): Post[] {
  return getAllPosts().filter((post) => getCategorySlug(post.category) === slug);
}

export function getPostsByTag(tagName: string): Post[] {
  return getAllPosts().filter((post) =>
    post.tags.some((tag) => tagSlug(tag) === tagSlug(tagName))
  );
}

export function getPostsByYear(year: string): Post[] {
  return getAllPosts().filter((post) => getYear(post.published) === year);
}

export function getCategories(): Category[] {
  const posts = getAllPosts();
  const map = new Map<string, Category>();

  posts.forEach((post) => {
    const slug = getCategorySlug(post.category);
    const existing = map.get(slug);
    if (existing) {
      existing.count++;
    } else {
      map.set(slug, {
        name: getCategoryLabel(slug),
        slug,
        count: 1,
      });
    }
  });

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function getTags(): Tag[] {
  const posts = getAllPosts();
  const map = new Map<string, Tag>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      const slug = tagSlug(tag);
      const existing = map.get(slug);
      if (existing) {
        existing.count++;
      } else {
        map.set(slug, {
          name: tag,
          slug,
          count: 1,
        });
      }
    });
  });

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function getArchiveYears(): ArchiveYear[] {
  const posts = getAllPosts();
  const map = new Map<string, number>();

  posts.forEach((post) => {
    const year = getYear(post.published);
    if (year) {
      map.set(year, (map.get(year) || 0) + 1);
    }
  });

  return Array.from(map.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year.localeCompare(a.year));
}

export function getRelatedPosts(currentPost: Post, count = 3): Post[] {
  const posts = getAllPosts().filter((post) => post.slug !== currentPost.slug);

  const scored = posts.map((post) => {
    let score = 0;
    if (getCategorySlug(post.category) === getCategorySlug(currentPost.category)) {
      score += 5;
    }
    const sharedTags = post.tags.filter((tag) =>
      currentPost.tags.includes(tag)
    );
    score += sharedTags.length * 2;
    return { post, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, count).map((item) => item.post);
}

export function getPrevNextPosts(currentPost: Post): {
  prev: Post | null;
  next: Post | null;
} {
  const posts = getAllPosts().sort(
    (a, b) => new Date(a.published).getTime() - new Date(b.published).getTime()
  );
  const index = posts.findIndex((post) => post.slug === currentPost.slug);

  return {
    prev: index > 0 ? posts[index - 1] : null,
    next: index < posts.length - 1 ? posts[index + 1] : null,
  };
}

export function getLatestPosts(count = 6): Post[] {
  return getAllPosts().slice(0, count);
}

export function getFeaturedPost(): Post | undefined {
  const featured = getAllPosts().find((post) => post.featured);
  return featured || getAllPosts()[0];
}

export function getPopularPosts(count = 6): Post[] {
  // Placeholder: use posts with images and longer reading time as "popular"
  return getAllPosts()
    .filter((post) => post.image && post.readingTime >= 3)
    .slice(0, count);
}

export function getRecentlyUpdated(count = 6): Post[] {
  return [...getAllPosts()]
    .sort(
      (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
    )
    .slice(0, count);
}

export function getEditorPicks(count = 4): Post[] {
  const posts = getAllPosts();
  const shuffled = [...posts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
