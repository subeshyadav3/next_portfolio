import { unstable_cache } from "next/cache";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/db/prisma";

const getDashboardStats = unstable_cache(
  async () => {
    const [postCount, draftCount, categoryCount, tagCount] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "DRAFT" } }),
      prisma.category.count(),
      prisma.tag.count(),
    ]);
    return { postCount, draftCount, categoryCount, tagCount };
  },
  ["admin:dashboard"],
  { revalidate: 60, tags: ["admin:dashboard"] }
);

export default async function AdminDashboard() {
  const session = await auth();
  const { postCount, draftCount, categoryCount, tagCount } = await getDashboardStats();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Welcome, {session?.user?.name ?? "Admin"}
      </h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        Here&apos;s your site at a glance.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Posts" value={postCount} />
        <StatCard label="Drafts" value={draftCount} />
        <StatCard label="Categories" value={categoryCount} />
        <StatCard label="Tags" value={tagCount} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}
