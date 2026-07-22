import { prisma } from "@/db/prisma";
import { CommentStatus } from "@prisma/client";

async function safeDbCall<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function getComments(postId: string, postSlug?: string) {
  return safeDbCall(async () => {
    const where = postId
      ? { postId, status: "APPROVED" as CommentStatus, parentId: null }
      : { postSlug, status: "APPROVED" as CommentStatus, parentId: null };
    return prisma.comment.findMany({
      where,
      include: {
        replies: {
          where: { status: "APPROVED" as CommentStatus },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }, []);
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
      status: "APPROVED",
    },
  });
}

export async function getCommentCount(postId: string) {
  return safeDbCall(async () => {
    return prisma.comment.count({
      where: { postId, status: "APPROVED" as CommentStatus },
    });
  }, 0);
}
