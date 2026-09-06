import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    await Promise.all([
      prisma.post.updateMany({
        where: { slug },
        data: { views: { increment: 1 } },
      }),
      prisma.pageView.create({
        data: {
          path: `/blog/${slug}`,
          slug,
        },
      }),
    ]);
  } catch {
    // DB unavailable — ignore so tracking never breaks the page
  }

  return NextResponse.json({ ok: true });
}
