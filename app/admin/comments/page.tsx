import { prisma } from "@/db/prisma";
import { AdminCommentsClient } from "./AdminCommentsClient";

export const dynamic = "force-dynamic";

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    include: {
      post: { select: { title: true, slug: true } },
      replies: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
  return <AdminCommentsClient initialComments={JSON.parse(JSON.stringify(comments))} />;
}
