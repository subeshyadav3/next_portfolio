import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ error: "postId is required" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { postId, status: "APPROVED", parentId: null },
    include: {
      replies: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(comments);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { postId, authorName, authorEmail, content, parentId } = body;

  if (!postId || !authorName || !content) {
    return NextResponse.json(
      { error: "postId, authorName, and content are required" },
      { status: 400 }
    );
  }

  if (content.length > 5000) {
    return NextResponse.json(
      { error: "Comment must be under 5000 characters" },
      { status: 400 }
    );
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { allowComments: true },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (!post.allowComments) {
    return NextResponse.json({ error: "Comments are closed" }, { status: 403 });
  }

  if (parentId) {
    const parent = await prisma.comment.findUnique({
      where: { id: parentId },
      select: { postId: true, parentId: true },
    });
    if (!parent || parent.postId !== postId) {
      return NextResponse.json({ error: "Invalid parent comment" }, { status: 400 });
    }
    if (parent.parentId) {
      return NextResponse.json({ error: "Cannot reply to a reply" }, { status: 400 });
    }
  }

  const comment = await prisma.comment.create({
    data: {
      postId,
      authorName,
      authorEmail: authorEmail ?? null,
      content,
      parentId: parentId ?? null,
      status: "PENDING",
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
