import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    await prisma.post.updateMany({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  } catch {
    // DB unavailable — ignore so tracking never breaks the page
  }

  return NextResponse.json({ ok: true });
}
