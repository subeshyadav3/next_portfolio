"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/db/prisma";

export async function updateProfileAction(authorId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Verify this author belongs to the logged-in user
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.authorId !== authorId) throw new Error("Not your profile");

  const name = (formData.get("name") as string)?.trim();
  const bio = (formData.get("bio") as string)?.trim() || null;
  const avatarUrl = (formData.get("avatarUrl") as string)?.trim() || null;
  const websiteUrl = (formData.get("websiteUrl") as string)?.trim() || null;
  const socialRaw = formData.get("social") as string | null;
  let social = null;
  if (socialRaw) {
    try {
      social = JSON.parse(socialRaw);
    } catch {}
  }

  if (!name) throw new Error("Name is required");

  // Update slug if name changed
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  await prisma.author.update({
    where: { id: authorId },
    data: { name, bio, avatarUrl, websiteUrl, social, slug },
  });

  // Also update the User name to match
  await prisma.user.update({
    where: { id: session.user.id },
    data: { name },
  });

  revalidatePath("/admin/profile");
  revalidatePath("/blog/author");
  revalidatePath(`/blog/author/${slug}`);
}
