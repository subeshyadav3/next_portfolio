import { MetadataRoute } from "next";
import {
  getAllPosts,
  getCategories,
  getTags,
  getArchiveYears,
} from "@/lib/blog/posts";
import { SITE_URL } from "@/lib/site-config";
import { IOE_ENABLED } from "@/lib/ioe/config";
import {
  getAllPrograms,
  findCatalogSubject,
  isSubjectPublic,
  getSubjectSlugFromName,
} from "@/lib/ioe/data";

const EXCLUDED_SLUGS = new Set([
  "project-i",
  "project-ii",
  "minor-project",
  "internship",
  "survey-camp",
  "engineering-workshop",
  "elective-i",
  "elective-ii",
  "elective-iii",
  "elective-iv",
]);

// Deep subject programs that have full chapter-wise question banks
const DEEP_PROGRAM_CODES = new Set(["bct", "bce", "bei", "bex"]);

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

  let ioeUrls: MetadataRoute.Sitemap = [];
  if (IOE_ENABLED) {
    const programs = getAllPrograms();

    ioeUrls = [
      {
        url: `${SITE_URL}/ioe`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/ioe/all`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      },
      // 1. Program Mega-Hub pages for all 12 programs
      ...programs.map((program) => ({
        url: `${SITE_URL}/ioe/${program.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      // 2. Semester pages for deep programs
      ...programs
        .filter((program) => DEEP_PROGRAM_CODES.has(program.code.toLowerCase()))
        .flatMap((program) => [
          ...Object.keys(program.semesters).map((semester) => ({
            url: `${SITE_URL}/ioe/${program.slug}/semester/${semester}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
          })),
          ...Object.entries(program.semesters).flatMap(([semester, rows]) =>
            rows
              .filter((row) => {
                const slug = getSubjectSlugFromName(row.title);
                if (EXCLUDED_SLUGS.has(slug)) return false;
                const cat = findCatalogSubject(row.title);
                return Boolean(cat && (cat.papers.length > 0 || isSubjectPublic(row.title)));
              })
              .map((row) => ({
                url: `${SITE_URL}/ioe/${program.slug}/semester/${semester}/${getSubjectSlugFromName(row.title)}`,
                lastModified: new Date(),
                changeFrequency: "monthly" as const,
                priority: 0.6,
              }))
          ),
        ]),
    ];
  }

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
      url: `${SITE_URL}/blog/author`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/blog/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/blog/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/blog/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/blog/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
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
    ...ioeUrls,
  ];
}
