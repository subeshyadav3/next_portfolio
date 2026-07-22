import { prisma } from "@/db/prisma";

export async function getTags(options?: { page?: number; limit?: number }) {
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 50;
  const skip = (page - 1) * limit;

  const [tags, total] = await Promise.all([
    prisma.tag.findMany({
      orderBy: { name: "asc" },
      skip,
      take: limit,
      include: { _count: { select: { posts: true } } },
    }),
    prisma.tag.count(),
  ]);

  return { tags, total, page, totalPages: Math.ceil(total / limit) };
}

export async function createTag(data: { slug: string; name: string }) {
  const existing = await prisma.tag.findUnique({ where: { slug: data.slug } });
  if (existing) return existing;
  return prisma.tag.create({ data });
}

export async function updateTag(id: string, data: { slug?: string; name?: string }) {
  return prisma.tag.update({ where: { id }, data });
}

export async function deleteTag(id: string) {
  return prisma.tag.delete({ where: { id } });
}
