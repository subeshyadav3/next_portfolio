import { prisma } from "@/db/prisma";
import type { CreatePostInput, UpdatePostInput } from "@/lib/validation/post";

export async function getPosts(options?: {
  status?: string;
  categoryId?: string;
  authorId?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (options?.status) where.status = options.status;
  if (options?.categoryId) where.categoryId = options.categoryId;
  if (options?.authorId) where.authorId = options.authorId;
  if (options?.search) {
    where.OR = [
      { title: { contains: options.search, mode: "insensitive" } },
      { excerpt: { contains: options.search, mode: "insensitive" } },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        category: { select: { name: true, slug: true } },
        author: { select: { name: true } },
        tags: { include: { tag: { select: { name: true, slug: true } } } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getPostById(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      category: true,
      author: true,
      tags: { include: { tag: true } },
      coverMedia: true,
      ogImage: true,
    },
  });
}

export async function createPost(data: CreatePostInput & { userId: string }) {
  const existing = await prisma.post.findUnique({ where: { slug: data.slug } });
  if (existing) {
    throw new Error(`A post with slug "${data.slug}" already exists. Change the slug and try again.`);
  }

  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt ?? null,
      language: data.language ?? "en",
      status: (data.status as any) ?? "DRAFT",
      metaTitle: data.metaTitle ?? null,
      metaDescription: data.metaDescription ?? null,
      focusKeyword: data.focusKeyword ?? null,
      canonicalUrl: data.canonicalUrl ?? null,
      noindex: data.noindex ?? false,
      classLevel: data.classLevel ?? null,
      subject: data.subject ?? null,
      board: data.board ?? null,
      difficulty: data.difficulty as any,
      examType: data.examType as any,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      wordCount: data.content.split(/\s+/).length,
      readingTimeMin: Math.max(1, Math.ceil(data.content.split(/\s+/).length / 200)),
      category: data.categoryId ? { connect: { id: data.categoryId } } : undefined,
      author: { connect: { id: data.authorId } },
      user: { connect: { id: data.userId } },
      coverMedia: data.coverMediaId ? { connect: { id: data.coverMediaId } } : undefined,
      ogImage: data.ogImageId ? { connect: { id: data.ogImageId } } : undefined,
      tags: data.tags?.length
        ? { create: data.tags.map((tagId: string) => ({ tagId })) }
        : undefined,
    },
    include: {
      category: true,
      author: true,
      tags: { include: { tag: true } },
    },
  });

  return post;
}

export async function updatePost(id: string, data: UpdatePostInput) {
  if (data.tags) {
    await prisma.postTag.deleteMany({ where: { postId: id } });
  }

  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.content !== undefined) {
    updateData.content = data.content;
    updateData.wordCount = data.content.split(/\s+/).length;
    updateData.readingTimeMin = Math.max(1, Math.ceil(data.content.split(/\s+/).length / 200));
  }
  if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
  if (data.language !== undefined) updateData.language = data.language;
  if (data.status !== undefined) {
    updateData.status = data.status;
    if (data.status === "PUBLISHED") {
      updateData.publishedAt = new Date();
    }
  }
  if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
  if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription;
  if (data.focusKeyword !== undefined) updateData.focusKeyword = data.focusKeyword;
  if (data.canonicalUrl !== undefined) updateData.canonicalUrl = data.canonicalUrl;
  if (data.noindex !== undefined) updateData.noindex = data.noindex;
  if (data.classLevel !== undefined) updateData.classLevel = data.classLevel;
  if (data.subject !== undefined) updateData.subject = data.subject;
  if (data.board !== undefined) updateData.board = data.board;
  if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
  if (data.examType !== undefined) updateData.examType = data.examType;
  if (data.categoryId !== undefined) {
    updateData.category = data.categoryId ? { connect: { id: data.categoryId } } : { disconnect: true };
  }
  if (data.coverMediaId !== undefined) {
    updateData.coverMedia = data.coverMediaId ? { connect: { id: data.coverMediaId } } : { disconnect: true };
  }
  if (data.ogImageId !== undefined) {
    updateData.ogImage = data.ogImageId ? { connect: { id: data.ogImageId } } : { disconnect: true };
  }
  if (data.tags?.length) {
    updateData.tags = { create: data.tags.map((tagId: string) => ({ tagId })) };
  }

  return prisma.post.update({
    where: { id },
    data: updateData,
    include: {
      category: true,
      author: true,
      tags: { include: { tag: true } },
    },
  });
}

export async function deletePost(id: string) {
  return prisma.post.update({
    where: { id },
    data: { status: "TRASHED" },
  });
}

export async function restorePost(id: string) {
  return prisma.post.update({
    where: { id },
    data: { status: "DRAFT" },
  });
}
