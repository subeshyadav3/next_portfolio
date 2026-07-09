import { prisma } from "@/db/prisma";

export async function getComments(postId: string) {
  return prisma.comment.findMany({
    where: { postId, status: "APPROVED", parentId: null },
    include: {
      replies: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createComment(data: {
  postId: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  parentId?: string;
}) {
  return prisma.comment.create({
    data: {
      postId: data.postId,
      authorName: data.authorName,
      authorEmail: data.authorEmail ?? null,
      content: data.content,
      parentId: data.parentId ?? null,
      status: "PENDING",
    },
  });
}

export async function getCommentCount(postId: string) {
  return prisma.comment.count({
    where: { postId, status: "APPROVED" },
  });
}
