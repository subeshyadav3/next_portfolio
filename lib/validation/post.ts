import { z } from "zod";

function optionalString() {
  return z.preprocess((v) => (v === "" || v === undefined || v === null ? undefined : v), z.string().optional());
}

function booleanish() {
  return z.union([z.boolean(), z.literal("true"), z.literal("false")]).transform((v) => v === true || v === "true");
}

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, hyphenated"),
  excerpt: optionalString(),
  content: z.string().min(1, "Content is required"),
  categoryId: optionalString(),
  authorId: z.string().optional(),
  language: z.enum(["en", "ne"]).default("en"),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]).default("DRAFT"),
  featured: booleanish().default(false),
  tags: z.array(z.string()).optional(),
  metaTitle: optionalString(),
  metaDescription: optionalString(),
  focusKeyword: optionalString(),
  canonicalUrl: z.preprocess((v) => (v === "" || v === undefined || v === null ? undefined : v), z.string().url().optional()),
  noindex: booleanish().default(false),
  coverMediaId: optionalString(),
  ogImageId: optionalString(),
  classLevel: optionalString(),
  subject: optionalString(),
  board: z.preprocess((v) => (v === "" || v === undefined || v === null ? undefined : v), z.enum(["NEB", "CDC", "CTEVT"]).optional()),
  difficulty: z.preprocess((v) => (v === "" || v === undefined || v === null ? undefined : v), z.enum(["EASY", "MEDIUM", "HARD"]).optional()),
  examType: z.preprocess((v) => (v === "" || v === undefined || v === null ? undefined : v), z.enum(["SEE", "BLE", "NEB", "IOE", "CEEC", "OTHER"]).optional()),
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
