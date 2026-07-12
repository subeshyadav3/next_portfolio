"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/db/prisma";
import { CommentStatus } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
  return session.user;
}

export async function deleteCommentAction(id: string) {
  await requireAdmin();
  await prisma.comment.delete({ where: { id } });
  revalidatePath("/admin/comments");
  revalidateTag("admin:comments");
}

export async function hideCommentAction(id: string) {
  await requireAdmin();
  await prisma.comment.update({
    where: { id },
    data: { status: CommentStatus.REJECTED },
  });
  revalidatePath("/admin/comments");
  revalidateTag("admin:comments");
}

export async function unhideCommentAction(id: string) {
  await requireAdmin();
  await prisma.comment.update({
    where: { id },
    data: { status: CommentStatus.APPROVED },
  });
  revalidatePath("/admin/comments");
  revalidateTag("admin:comments");
}

export async function editCommentAction(id: string, formData: FormData) {
  await requireAdmin();
  const content = formData.get("content") as string;
  if (!content?.trim()) throw new Error("Content is required");
  await prisma.comment.update({
    where: { id },
    data: { content: content.trim() },
  });
  revalidatePath("/admin/comments");
  revalidateTag("admin:comments");
}

export async function replyToCommentAction(parentId: string, formData: FormData) {
  const user = await requireAdmin();
  const content = formData.get("content") as string;
  if (!content?.trim()) throw new Error("Content is required");

  // Get the parent comment to attach post relation
  const parent = await prisma.comment.findUnique({
    where: { id: parentId },
    select: { postId: true, postSlug: true },
  });
  if (!parent) throw new Error("Parent comment not found");

  await prisma.comment.create({
    data: {
      postId: parent.postId,
      postSlug: parent.postSlug,
      parentId,
      authorName: user.name ?? "Admin",
      content: content.trim(),
      status: CommentStatus.APPROVED,
    },
  });
  revalidatePath("/admin/comments");
  revalidateTag("admin:comments");
}
