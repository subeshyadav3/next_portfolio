import { Post } from "./types";

const SITE_URL = "https://subeshyadav.com.np";
const SITE_NAME = "Subesh Yadav";

export function generateArticleSchema(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.image || `${SITE_URL}/blog/opengraph-image`,
    datePublished: post.published,
    dateModified: post.updated,
    author: {
      "@type": "Person",
      name: post.author,
      url: post.authorUrl,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    articleSection: post.category,
    keywords: [post.category, ...post.tags].join(", "),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    sameAs: [
      "https://github.com/subeshyadav3",
      "https://www.linkedin.com/in/subeshyadav",
    ],
  };
}

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Subesh Yadav",
    url: SITE_URL,
    jobTitle: "Full Stack Developer",
    sameAs: [
      "https://github.com/subeshyadav3",
      "https://www.linkedin.com/in/subeshyadav",
    ],
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/blog/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
