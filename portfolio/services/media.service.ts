import { prisma } from "@/db/prisma";

export async function getMedia(options?: { type?: string; page?: number; limit?: number }) {
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 30;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (options?.type) where.type = options.type;

  const [media, total] = await Promise.all([
    prisma.media.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.media.count({ where }),
  ]);

  return { media, total, page, totalPages: Math.ceil(total / limit) };
}

export async function saveMedia(data: {
  publicId: string;
  secureUrl: string;
  type?: string;
  mimeType?: string;
  bytes?: number;
  width?: number;
  height?: number;
  uploadedById?: string;
}) {
  return prisma.media.create({ data: { ...data, type: (data.type as any) ?? "IMAGE" } });
}

export async function deleteMedia(id: string) {
  return prisma.media.delete({ where: { id } });
}
