import { Post } from "./types";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export function generateArticleSchema(
  post: Post,
  edu?: {
    classLevel?: string | null;
    subject?: string | null;
    board?: string | null;
    difficulty?: string | null;
    examType?: string | null;
    series?: string | null;
  }
) {
  const hasEdu = edu?.classLevel || edu?.subject || edu?.board || edu?.examType || edu?.difficulty;
  const types = hasEdu ? ["BlogPosting", "LearningResource"] : ["BlogPosting"];
  return {
    "@context": "https://schema.org",
    "@type": hasEdu ? ["BlogPosting", "LearningResource"] : "BlogPosting",
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
    ...(edu?.difficulty && {
      educationalLevel: edu.difficulty.toLowerCase(),
    }),
    ...(edu?.subject && {
      about: {
        "@type": "Thing",
        name: edu.subject,
      },
    }),
    ...(edu?.classLevel && {
      teaches: edu.classLevel.replace(/-/g, " "),
    }),
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

export function generateFAQSchema(qaPairs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qaPairs.map((qa) => ({
      "@type": "Question",
      name: qa.question,
      acceptedAnswer: { "@type": "Answer", text: qa.answer },
    })),
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
