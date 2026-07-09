import Link from "next/link";
import { getPosts } from "@/services/posts.service";
import { deletePostAction, restorePostAction } from "@/actions/posts";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; search?: string; created?: string; updated?: string }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1", 10);
  const { posts, total, totalPages } = await getPosts({
    page,
    status: sp.status,
    search: sp.search,
    limit: 20,
  });

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
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New Post
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <Th>Title</Th>
              <Th>Status</Th>
              <Th>Category</Th>
              <Th>Author</Th>
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
