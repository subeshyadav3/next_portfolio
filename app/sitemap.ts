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
  getSubjectSlugFromName,
} from "@/lib/ioe/data";

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
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  const tagUrls = tags
    .filter((tag) => tag.count >= 3)
    .map((tag) => ({
      url: `${SITE_URL}/blog/tag/${tag.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

  const archiveUrls = archives.map((archive) => ({
    url: `${SITE_URL}/blog/archive/${archive.year}`,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  let ioeUrls: MetadataRoute.Sitemap = [];
  if (IOE_ENABLED) {
    const programs = getAllPrograms();

    // 1. Core portal & archive index
    const coreUrls = [
      {
        url: `${SITE_URL}/ioe`,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/ioe/all`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
      {
        url: `${SITE_URL}/ioe/other-programs`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
    ];

    // 2. Program Mega-Hub pages for all 12 engineering disciplines
    const programUrls = programs.map((program) => ({
      url: `${SITE_URL}/ioe/${program.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // 3. Direct Semester Hub views
    const semesterUrls = programs.flatMap((program) =>
      Object.keys(program.semesters).map((semester) => ({
        url: `${SITE_URL}/ioe/${program.slug}/semester/${semester}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    );

    // 4. Individual subject pages with cataloged past-paper PDFs
    const subjectUrls = programs.flatMap((program) =>
      Object.entries(program.semesters).flatMap(([semester, subjects]) =>
        subjects
          .filter((subject) => Boolean(findCatalogSubject(subject.title)))
          .map((subject) => ({
            url: `${SITE_URL}/ioe/${program.slug}/semester/${semester}/${getSubjectSlugFromName(subject.title)}`,
            changeFrequency: "monthly" as const,
            priority: 0.8,
          }))
      )
    );

    ioeUrls = [...coreUrls, ...programUrls, ...semesterUrls, ...subjectUrls];
  }

  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog/author`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/blog/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/blog/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/blog/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/blog/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/blog/disclaimer`,
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
