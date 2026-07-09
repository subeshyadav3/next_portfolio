/**
 * Import legacy MDX files into the PostgreSQL database.
 *
 * Usage:  npm run import:mdx
 *
 * Reads all .mdx / .md files from `final_content/blog/`, resolves
 * author / category / tag names to DB IDs (creating records as
 * needed), and inserts each post into the `Post` table.
 *
 * Skips slugs that already exist in the DB so it is safe to re-run.
 *
 * After the import completes, swap `CompositeSource` to DB-first
 * (already the default) and eventually remove the FS fallback.
 */

import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import { prisma } from "../db/prisma";
import { slugifyText } from "../lib/blog/slugs";
import { getCategorySlug } from "../lib/blog/categories";

/* -------------------------------------------------------------------------- */
/*  Configuration                                                             */
/* -------------------------------------------------------------------------- */

const POSTS_DIR = path.join(process.cwd(), "final_content", "blog");
const BATCH_SIZE = 50;

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

async function resolveAuthorId(name: string): Promise<string> {
  const slug = slugifyText(name);
  const existing = await prisma.author.findUnique({ where: { slug } });
  if (existing) return existing.id;
  const created = await prisma.author.create({
    data: { slug, name, websiteUrl: "https://subeshyadav.com.np" },
  });
  return created.id;
}

async function resolveCategoryId(name: string): Promise<string | null> {
  if (!name) return null;
  const slug = getCategorySlug(name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return existing.id;
  const created = await prisma.category.create({
    data: {
      slug,
      name,
      description: `Articles in ${name}`,
    },
  });
  return created.id;
}

async function resolveTagId(name: string): Promise<string> {
  const slug = slugifyText(name);
  const existing = await prisma.tag.findUnique({ where: { slug } });
  if (existing) return existing.id;
  const created = await prisma.tag.create({
    data: { slug, name },
  });
  return created.id;
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/* -------------------------------------------------------------------------- */
/*  Main                                                                      */
/* -------------------------------------------------------------------------- */

async function main() {
  console.log(`Reading MDX files from ${POSTS_DIR} ...`);

  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`Directory not found: ${POSTS_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  if (files.length === 0) {
    console.log("No MDX files found. Nothing to do.");
    return;
  }

  console.log(`Found ${files.length} files.\n`);

  // Resolve the default author once.
  const defaultAuthorId = await resolveAuthorId("Subesh Yadav");

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);

    await prisma.$transaction(async (tx) => {
      for (const file of batch) {
        const filePath = path.join(POSTS_DIR, file);

        try {
          const raw = fs.readFileSync(filePath, "utf-8");
          const { data, content } = matter(raw);

          const slug = data.slug;
          if (!slug) {
            console.warn(`  SKIP  ${file} — missing slug`);
            skipped++;
            continue;
          }

          // Dedup: skip if already in DB
          const existing = await tx.post.findUnique({
            where: { slug },
            select: { id: true },
          });
          if (existing) {
            skipped++;
            continue;
          }

          // Resolve IDs
          const authorId = data.author
            ? await resolveAuthorId(data.author)
            : defaultAuthorId;

          const categoryId = data.category
            ? await resolveCategoryId(data.category)
            : null;

          const tagIds = Array.isArray(data.tags)
            ? await Promise.all(data.tags.map((t: string) => resolveTagId(t)))
            : [];

          const publishedAt = data.published
            ? new Date(data.published)
            : new Date();

          const updatedAt = data.updated
            ? new Date(data.updated)
            : publishedAt;

          const language: string =
            data.language === "ne" || data.language === "en"
              ? data.language
              : "en";

          await tx.post.create({
            data: {
              slug,
              title: String(data.title ?? slug),
              content,
              excerpt: String(data.description ?? "").slice(0, 500) || null,
              language,
              status: "PUBLISHED",
              source: "IMPORTED",
              legacyFilePath: file,
              publishedAt,
              updatedAt,
              featured: Boolean(data.featured),
              readingTimeMin: data.readingTime ?? Math.max(1, Math.ceil(countWords(content) / 200)),
              wordCount: countWords(content),
              author: { connect: { id: authorId } },
              ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
              ...(tagIds.length > 0
                ? { tags: { create: tagIds.map((tagId) => ({ tagId })) } }
                : {}),
            },
          });

          imported++;
        } catch (err) {
          console.error(`  ERROR ${file} —`, (err as Error).message);
          errors++;
        }
      }
    });
  }

  console.log(`\nDone.  Imported: ${imported}  Skipped: ${skipped}  Errors: ${errors}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Fatal:", err);
    process.exit(1);
  });
