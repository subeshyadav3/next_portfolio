/**
 * IOE SEO helpers — metadata + JSON-LD for /ioe routes.
 */

import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";
import type { IoeProgram } from "./types";
import { getSubjectSlugFromName } from "./data";

export function ioeAbsolute(path: string): string {
  return `${SITE_URL}${path}`;
}

export interface IoePageSeo {
  title: string;
  description: string;
  path: string;
}

export function buildIoeMetadata(seo: IoePageSeo): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: seo.title,
    description: seo.description,
    alternates: { canonical: ioeAbsolute(seo.path) },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: ioeAbsolute(seo.path),
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
  };
}

export function jsonLd(script: Record<string, unknown>): string {
  return JSON.stringify(script);
}

export function breadcrumbLd(
  items: Array<{ name: string; path: string }>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: ioeAbsolute(item.path),
    })),
  };
}

export function collectionLd(
  name: string,
  description: string,
  path: string,
  items: Array<{ name: string; path: string }>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: ioeAbsolute(path),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: ioeAbsolute(item.path),
      })),
    },
  };
}

export function learningResourceLd(input: {
  title: string;
  description: string;
  path: string;
  program?: IoeProgram;
  semester?: string;
  papers: number;
  questions?: number;
}): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: input.title,
    description: input.description,
    url: ioeAbsolute(input.path),
    educationalLevel: "University",
    learningResourceType: "Past Examination Papers and Syllabus",
    numberOfItems: input.papers,
  };

  if (input.program) {
    schema.isPartOf = {
      "@type": "Course",
      name: input.program.fullName,
      courseCode: input.program.code,
    };
  }

  return schema;
}

export { getSubjectSlugFromName };