"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { auth } from "@/lib/auth/config";
import { slugifyText } from "@/lib/blog/slugs";
import { createCategory, updateCategory, deleteCategory } from "@/services/categories.service";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
}

export async function createCategoryAction(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  let slug = formData.get("slug") as string;
  const description = formData.get("description") as string;

  if (!slug) slug = slugifyText(name);

  await createCategory({ slug, name, description: description || undefined });
  revalidatePath("/admin/categories");
  revalidateTag("categories:list");
  revalidateTag("admin:dashboard");
}

export async function updateCategoryAction(id: string, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;

  await updateCategory(id, { slug, name, description: description || undefined });
  revalidatePath("/admin/categories");
  revalidateTag("categories:list");
  revalidateTag("admin:dashboard");
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  await deleteCategory(id);
  revalidatePath("/admin/categories");
  revalidateTag("categories:list");
  revalidateTag("admin:dashboard");
}
