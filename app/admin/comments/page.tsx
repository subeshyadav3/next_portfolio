import { prisma } from "@/db/prisma";
import { unstable_cache } from "next/cache";
import { AdminCommentsClient } from "./AdminCommentsClient";

const getCachedComments = unstable_cache(
  async () => {
    return prisma.comment.findMany({
      include: {
        post: { select: { title: true, slug: true } },
        replies: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });
  },
  ["admin:comments"],
  { revalidate: 15, tags: ["admin:comments"] }
);

export default async function AdminCommentsPage() {
  const comments = await getCachedComments();
  return <AdminCommentsClient initialComments={JSON.parse(JSON.stringify(comments))} />;
}
