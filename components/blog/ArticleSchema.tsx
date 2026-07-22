/**
 * ArticleSchema.tsx
 * Renders JSON-LD Article structured data for Google rich results.
 *
 * Usage in your post page:
 *   import { ArticleSchema } from "@/components/blog/ArticleSchema";
 *   <ArticleSchema post={post} />
 */

import type { Post } from "@/lib/blog/types";

interface ArticleSchemaProps {
  post: Post;
  /** Your site's base URL, e.g. "https://example.com" */
  siteUrl?: string;
  /** Your site name shown in Google rich results */
  siteName?: string;
  /** Absolute URL to your site logo (at least 112×112 px) */
  logoUrl?: string;
}

export function ArticleSchema({
  post,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "",
  siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "My Blog",
  logoUrl,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:      post.title,
    description:   post.description,
    image:         post.image ? [post.image] : undefined,
    datePublished: post.published,
    dateModified:  post.updated || post.published,
    author: {
      "@type": "Person",
      name:    post.author,
      url:     post.authorUrl || siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name:    siteName,
      logo:    logoUrl
        ? { "@type": "ImageObject", url: logoUrl }
        : undefined,
    },
    mainEntityOfPage: {
      "@type": "@id",
      "@id":   `${siteUrl}/blog/${post.slug}`,
    },
    inLanguage: post.language === "ne" ? "ne" : "en",
    keywords:   post.tags?.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
