import { Metadata } from "next";
import { Post, Category, Tag } from "./types";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, BLOG_NAME } from "@/lib/site-config";
import { getCategoryDescription } from "./categories";

const BLOG_TITLE = `${BLOG_NAME} | ${SITE_NAME}`;
const BLOG_DESCRIPTION = SITE_DESCRIPTION;

export function generatePostMetadata(post: Post): Metadata {
  const title = post.title;
  const description = post.description || post.title;
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.image || `${SITE_URL}/blog/opengraph-image`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        [post.language]: url,
      },
    },
    authors: [{ name: post.author, url: post.authorUrl }],
    keywords: [post.category, ...post.tags],
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "article",
      publishedTime: post.published,
      modifiedTime: post.updated,
      authors: [post.authorUrl],
      section: post.category,
      tags: post.tags,
      images: image
        ? [
            {
              url: image,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export function generateBlogMetadata(): Metadata {
  return {
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    alternates: {
      canonical: `${SITE_URL}/blog`,
    },
    openGraph: {
      title: BLOG_TITLE,
      description: BLOG_DESCRIPTION,
      url: `${SITE_URL}/blog`,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: BLOG_TITLE,
      description: BLOG_DESCRIPTION,
    },
  };
}

export function generateCategoryMetadata(category: Category): Metadata {
  const title = `${category.name} Articles | Subesh Yadav Blog`;
  const description = getCategoryDescription(category.slug);
  const url = `${SITE_URL}/blog/category/${category.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function generateTagMetadata(tag: Tag): Metadata {
  const title = `#${tag.name} Articles | Subesh Yadav Blog`;
  const description = `Read ${tag.count} articles tagged with ${tag.name}.`;
  const url = `${SITE_URL}/blog/tag/${tag.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function generateArchiveMetadata(year: string): Metadata {
  const title = `Archive ${year} | Subesh Yadav Blog`;
  const description = `All blog posts published in ${year}.`;
  const url = `${SITE_URL}/blog/archive/${year}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
