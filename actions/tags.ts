"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/config";
import { slugifyText } from "@/lib/blog/slugs";
import { createTag, updateTag, deleteTag } from "@/services/tags.service";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
}

export async function createTagAction(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  let slug = formData.get("slug") as string;

  if (!slug) slug = slugifyText(name);

  await createTag({ slug, name });
  revalidatePath("/admin/tags");
}

export async function updateTagAction(id: string, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  await updateTag(id, { slug, name });
  revalidatePath("/admin/tags");
}

export async function deleteTagAction(id: string) {
  await requireAdmin();
  await deleteTag(id);
  revalidatePath("/admin/tags");
}
