import { prisma } from "@/db/prisma";

export async function getCategories(options?: { page?: number; limit?: number }) {
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 50;
  const skip = (page - 1) * limit;

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
      skip,
      take: limit,
      include: { _count: { select: { posts: true } } },
    }),
    prisma.category.count(),
  ]);

  return { categories, total, page, totalPages: Math.ceil(total / limit) };
}

export async function createCategory(data: { slug: string; name: string; description?: string }) {
  const existing = await prisma.category.findUnique({ where: { slug: data.slug } });
  if (existing) return existing;
  return prisma.category.create({ data });
}

export async function updateCategory(id: string, data: { slug?: string; name?: string; description?: string }) {
  return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}
