import { MetadataRoute } from "next";
import {
  getAllPosts,
  getCategories,
  getTags,
  getArchiveYears,
} from "@/lib/blog/posts";
import { SITE_URL } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const categories = await getCategories();
  const tags = await getTags();
  const archives = await getArchiveYears();

  const postUrls = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categoryUrls = categories
    .filter((category) => category.count > 0)
    .map((category) => ({
      url: `${SITE_URL}/blog/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  const tagUrls = tags
    .filter((tag) => tag.count >= 3)
    .map((tag) => ({
      url: `${SITE_URL}/blog/tag/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

  const archiveUrls = archives.map((archive) => ({
    url: `${SITE_URL}/blog/archive/${archive.year}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/blog/author`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/blog/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...postUrls,
    ...categoryUrls,
    ...tagUrls,
    ...archiveUrls,
  ];
}
