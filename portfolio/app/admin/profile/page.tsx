import { auth } from "@/lib/auth/config";
import { prisma } from "@/db/prisma";
import { ProfileEditor } from "@/components/admin/ProfileEditor";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Profile | CMS",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { author: true },
  });

  if (!user) redirect("/admin/login");

  // Auto-link to author if not linked yet
  let author = user.author;
  if (!author) {
    const name = user.name ?? user.email.split("@")[0];
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    author = await prisma.author.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        name,
        avatarUrl: user.image,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { authorId: author.id },
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Your Profile
      </h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Edit your author profile — this appears on your blog posts.
      </p>

      <div className="mt-8">
        <ProfileEditor author={author} />
      </div>
    </div>
  );
}
