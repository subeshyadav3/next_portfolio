import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    select: { id: true, slug: true, title: true, language: true, status: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  console.log("Total posts:", posts.length);
  posts.forEach((p) =>
    console.log(`  - ${p.slug} [${p.language}] [${p.status}] ${p.title}`)
  );
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });