import Link from "next/link";
import { getAllPosts, getCategories } from "@/lib/blog/posts";

export default async function NotFound() {
  const [popular, categories] = await Promise.all([
    getAllPosts().then((p) => p.slice(0, 6)),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-7xl font-bold text-[var(--blog-accent)]">404</h1>
      <p className="mt-4 text-xl text-[var(--blog-text-secondary)]">
        Page not found
      </p>
      <p className="mt-2 text-[var(--blog-text-muted)]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/blog"
          className="rounded-lg bg-[var(--blog-accent)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Browse Blog
        </Link>
        <Link
          href="/blog/search"
          className="rounded-lg border border-[var(--blog-border)] px-5 py-2.5 text-sm font-medium text-[var(--blog-text)] hover:border-[var(--blog-accent)]"
        >
          Search Articles
        </Link>
      </div>

      {categories.length > 0 && (
        <div className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--blog-text-muted)]">
            Browse by Category
          </h2>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog/category/${cat.slug}`}
                className="rounded-full bg-[var(--blog-surface)] px-3 py-1 text-sm text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)] border border-[var(--blog-border)]"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {popular.length > 0 && (
        <div className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--blog-text-muted)]">
            Popular Articles
          </h2>
          <ul className="mt-4 space-y-2">
            {popular.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)]"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
