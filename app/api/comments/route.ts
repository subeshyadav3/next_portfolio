import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { CommentStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  const postSlug = searchParams.get("postSlug");

  if (!postId && !postSlug) {
    return NextResponse.json({ error: "postId or postSlug is required" }, { status: 400 });
  }

  const whereClause = postId 
    ? { postId, status: CommentStatus.APPROVED, parentId: null }
    : { postSlug, status: CommentStatus.APPROVED, parentId: null };

  const comments = await prisma.comment.findMany({
    where: whereClause,
    include: {
      replies: {
        where: { status: CommentStatus.APPROVED },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(comments);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { postId, postSlug, authorName, authorEmail, content, parentId } = body;

  if ((!postId && !postSlug) || !authorName || !content) {
    return NextResponse.json(
      { error: "postId or postSlug, authorName, and content are required" },
      { status: 400 }
    );
  }

  if (content.length > 5000) {
    return NextResponse.json(
      { error: "Comment must be under 5000 characters" },
      { status: 400 }
    );
  }

  // Check if post exists and allows comments
  let post = null;
  if (postId) {
    post = await prisma.post.findUnique({
      where: { id: postId },
      select: { allowComments: true },
    });
  } else if (postSlug) {
    post = await prisma.post.findUnique({
      where: { slug: postSlug },
      select: { allowComments: true, id: true },
    });
  }

  // For MDX posts not in DB, allow comments by default
  if (!post && postSlug) {
    // Allow comments for MDX posts (not in DB)
  } else if (post && !post.allowComments) {
    return NextResponse.json({ error: "Comments are closed" }, { status: 403 });
  }

  if (parentId) {
    const parent = await prisma.comment.findUnique({
      where: { id: parentId },
      select: { postId: true, parentId: true, postSlug: true },
    });
    const parentPostId = parent?.postId;
    const parentPostSlug = parent?.postSlug;
    if (!parent || (postId && parentPostId !== postId) || (postSlug && parentPostSlug !== postSlug)) {
      return NextResponse.json({ error: "Invalid parent comment" }, { status: 400 });
    }
    if (parent.parentId) {
      return NextResponse.json({ error: "Cannot reply to a reply" }, { status: 400 });
    }
  }

  const comment = await prisma.comment.create({
    data: {
      postId: postId ?? null,
      postSlug: postSlug ?? null,
      authorName,
      authorEmail: authorEmail ?? null,
      content,
      parentId: parentId ?? null,
      status: CommentStatus.APPROVED,
    },
  });

  // Invalidate admin comments cache
  const { revalidateTag } = await import("next/cache");
  revalidateTag("admin:comments");

  return NextResponse.json(comment, { status: 201 });
}
