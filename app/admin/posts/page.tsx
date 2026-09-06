import Link from "next/link";
import { getPosts, getViewsStats, ViewsPeriod } from "@/services/posts.service";
import { deletePostAction, restorePostAction } from "@/actions/posts";
import { IoeAdminPanel } from "@/components/admin/IoeAdminPanel";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; search?: string; created?: string; updated?: string; area?: string; period?: string }>;
}) {
  const sp = await searchParams;
  const area = sp.area === "ioe" ? "ioe" : "blog";

  if (area === "ioe") {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Posts</h1>
        <div className="mt-4 flex gap-2">
          <Link
            href="/admin/posts"
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300"
          >
            Blog
          </Link>
          <span className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
            IOE
          </span>
        </div>
        <div className="mt-4">
          <IoeAdminPanel />
        </div>
      </div>
    );
  }

  const page = parseInt(sp.page ?? "1", 10);
  const period: ViewsPeriod = (sp.period === "week" || sp.period === "month") ? sp.period : "all";
  const [{ posts, total, totalPages }, viewsStats] = await Promise.all([
    getPosts({
      page,
      status: sp.status,
      search: sp.search,
      limit: 20,
    }),
    getViewsStats(period),
  ]);

  const showCreated = sp.created === "1";
  const showUpdated = sp.updated === "1";

  return (
    <div>
      {showCreated && (
        <div className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-800 dark:bg-green-900 dark:text-green-200">
          Post created successfully!
        </div>
      )}
      {showUpdated && (
        <div className="mb-4 rounded-lg bg-blue-100 px-4 py-3 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          Post updated successfully!
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Posts</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/posts?area=ioe"
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300"
          >
            IOE
          </Link>
          <Link
            href="/admin/posts/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            New Post
          </Link>
        </div>
      </div>

      {/* Website & Post Views Section */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Website Traffic & Views
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Overview of all visits across the entire website and individual blog posts.
            </p>
          </div>

          {/* Timeframe Filter: All Time, Monthly, Weekly */}
          <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 text-xs font-medium dark:bg-gray-800">
            <Link
              href={buildPeriodLink(sp, "all")}
              className={`rounded-md px-3 py-1.5 transition-colors ${
                period === "all"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              All Time
            </Link>
            <Link
              href={buildPeriodLink(sp, "month")}
              className={`rounded-md px-3 py-1.5 transition-colors ${
                period === "month"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              This Month
            </Link>
            <Link
              href={buildPeriodLink(sp, "week")}
              className={`rounded-md px-3 py-1.5 transition-colors ${
                period === "week"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              This Week
            </Link>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
            <span className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Total Website Views
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {viewsStats.websiteViews.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {period === "week" ? "past 7 days" : period === "month" ? "past 30 days" : "entire site"}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Home, Blog, IOE, Syllabus & Notes
            </p>
          </div>

          <div className="rounded-lg border border-purple-100 bg-purple-50/50 p-4 dark:border-purple-900/40 dark:bg-purple-950/20">
            <span className="text-xs font-medium uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Blog Posts Views
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {viewsStats.postViews.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {period === "week" ? "past 7 days" : period === "month" ? "past 30 days" : "all posts"}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Articles, essays, poems, and questions
            </p>
          </div>

          <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <span className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Other Pages Views
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {viewsStats.otherViews.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {period === "week" ? "past 7 days" : period === "month" ? "past 30 days" : "non-post views"}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Portfolio home, IOE portal, etc.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <Th>Title</Th>
              <Th>Status</Th>
              <Th>Category</Th>
              <Th>Author</Th>
              <Th>Views</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                  >
                    {post.title}
                  </Link>
                  {post.featured && (
                    <span className="ml-2 rounded bg-yellow-100 px-1.5 py-0.5 text-xs text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={post.status} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {post.category?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {post.author?.name}
                </td>
                <td className="px-4 py-3 text-sm tabular-nums text-gray-600 dark:text-gray-400">
                  {post.views ?? 0}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                      Edit
                    </Link>
                    {post.slug && (
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
                        target="_blank"
                      >
                        View
                      </Link>
                    )}
                    {post.status === "TRASHED" ? (
                      <form action={restorePostAction.bind(null, post.id)}>
                        <button type="submit" className="text-sm text-green-600 hover:text-green-800">
                          Restore
                        </button>
                      </form>
                    ) : (
                      <form action={deletePostAction.bind(null, post.id)}>
                        <button type="submit" className="text-sm text-red-600 hover:text-red-800">
                          Trash
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/posts?page=${p}`}
              className={`rounded px-3 py-1.5 text-sm ${
                p === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
      {children}
    </th>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    PUBLISHED: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    SCHEDULED: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    ARCHIVED: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    TRASHED: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? colors.DRAFT}`}
    >
      {status}
    </span>
  );
}

function buildPeriodLink(sp: Record<string, string | undefined>, newPeriod: string) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v && k !== "period") params.set(k, v);
  }
  if (newPeriod !== "all") params.set("period", newPeriod);
  const q = params.toString();
  return q ? `/admin/posts?${q}` : "/admin/posts";
}
