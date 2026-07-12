"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { auth } from "@/lib/auth/config";
import { createPostSchema, updatePostSchema } from "@/lib/validation/post";
import {
  createPost,
  updatePost,
  deletePost as deletePostService,
  restorePost as restorePostService,
  getPostById,
} from "@/services/posts.service";
import { slugifyText } from "@/lib/blog/slugs";
import { prisma } from "@/db/prisma";

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user;
}

async function resolveTagNames(names: string[]): Promise<string[]> {
  const ids: string[] = [];
  for (const name of names) {
    const trimmed = name.trim();
    if (!trimmed) continue;
    const slug = slugifyText(trimmed);
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { slug, name: trimmed },
    });
    ids.push(tag.id);
  }
  return ids;
}

function parseForm(formData: FormData): Record<string, unknown> {
  const raw: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    if (key === "tags") {
      if (!raw[key]) raw[key] = [];
      (raw[key] as string[]).push(value as string);
    } else if (key === "noindex") {
      raw[key] = value === "true";
    } else if (key === "featured") {
      raw[key] = value === "true";
    } else {
      raw[key] = value;
    }
  }

  return raw;
}

function cleanEmpty(raw: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (value === "" || value === undefined) continue;
    cleaned[key] = value;
  }
  return cleaned;
}

export async function createPostAction(formData: FormData) {
  const user = await requireAuth();

  const raw = parseForm(formData);
  const cleaned = cleanEmpty(raw);

  if (cleaned.tagNames) {
    const names = (cleaned.tagNames as string).split(",").map((s: string) => s.trim()).filter(Boolean);
    cleaned.tags = await resolveTagNames(names);
    delete cleaned.tagNames;
  }

  const parsed = createPostSchema.parse(cleaned);

  await createPost({ ...parsed, userId: user.id });
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  revalidateTag("posts:list");
  revalidateTag("posts:featured");
  revalidateTag("posts:popular");
  revalidateTag("posts:recent");
  revalidateTag("posts:picks");
  revalidateTag("posts:latest");
  revalidateTag("admin:dashboard");
  redirect("/admin/posts?created=1");
}

export async function updatePostAction(id: string, formData: FormData) {
  await requireAuth();

  const raw = parseForm(formData);
  const cleaned = cleanEmpty(raw);

  if (cleaned.tagNames) {
    const names = (cleaned.tagNames as string).split(",").map((s: string) => s.trim()).filter(Boolean);
    cleaned.tags = await resolveTagNames(names);
    delete cleaned.tagNames;
  }

  const parsed = updatePostSchema.parse(cleaned);

  await getPostById(id);
  await updatePost(id, parsed);
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  revalidateTag("posts:list");
  revalidateTag("posts:featured");
  revalidateTag("posts:popular");
  revalidateTag("posts:recent");
  revalidateTag("posts:picks");
  revalidateTag("posts:latest");
  revalidateTag("admin:dashboard");
  redirect("/admin/posts?updated=1");
}

export async function deletePostAction(id: string) {
  await requireAuth();
  await deletePostService(id);
  revalidatePath("/admin/posts");
  revalidateTag("posts:list");
  revalidateTag("posts:featured");
  revalidateTag("posts:popular");
  revalidateTag("posts:recent");
  revalidateTag("posts:picks");
  revalidateTag("posts:latest");
  revalidateTag("admin:dashboard");
}

export async function restorePostAction(id: string) {
  await requireAuth();
  await restorePostService(id);
  revalidatePath("/admin/posts");
  revalidateTag("posts:list");
  revalidateTag("posts:featured");
  revalidateTag("posts:popular");
  revalidateTag("posts:recent");
  revalidateTag("posts:picks");
  revalidateTag("posts:latest");
  revalidateTag("admin:dashboard");
}
