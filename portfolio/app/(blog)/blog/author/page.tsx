import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllAuthors, getAllPosts } from "@/lib/blog/posts";
import { formatDate } from "@/lib/blog/utils";
import { Breadcrumb } from "@/components/blog/Breadcrumb";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Authors | Neb Master",
  description:
    "Meet the writers behind Neb Master — essays, poems, study materials, and more from Nepal and beyond.",
  alternates: {
    canonical: `${SITE_URL}/blog/author`,
  },
  openGraph: {
    title: "Authors — Neb Master",
    description: "Meet the writers behind Neb Master.",
    type: "website",
  },
};

export default async function AuthorsPage() {
  const [authors, posts] = await Promise.all([
    getAllAuthors(),
    getAllPosts({ limit: 6 }),
  ]);

  return (
    <>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Blog", href: "/blog" },
            { label: "Authors", href: "/blog/author" },
          ]}
        />

        <div className="mt-8">
          <h1 className="text-3xl font-bold text-[var(--blog-text)] sm:text-4xl">
            Authors
          </h1>
          <p className="mt-3 text-lg text-[var(--blog-text-secondary)]">
            The people writing essays, poems, exam notes, and more on Neb
            Master.
          </p>
        </div>

        {/* Author cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {authors.map((author) => (
            <Link
              key={author.id}
              href={`/blog/author/${author.slug}`}
              className="group rounded-2xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-6 hover:border-[var(--blog-accent)] hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                {author.avatarUrl ? (
                  <Image
                    src={author.avatarUrl}
                    alt={author.name}
                    width={72}
                    height={72}
                    className="rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-[72px] h-[72px] rounded-full bg-[var(--blog-accent)]/20 flex items-center justify-center text-2xl font-bold text-[var(--blog-accent)] shrink-0">
                    {author.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-[var(--blog-text)] group-hover:text-[var(--blog-accent)] transition-colors">
                    {author.name}
                  </h2>
                  {author.bio && (
                    <p className="mt-1 text-sm text-[var(--blog-text-secondary)] line-clamp-2 leading-relaxed">
                      {author.bio}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-4 text-xs text-[var(--blog-text-muted)]">
                    <span>
                      {author.postCount}{" "}
                      {author.postCount === 1 ? "article" : "articles"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {authors.length === 0 && (
          <div className="mt-10 rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-8 text-center">
            <p className="text-[var(--blog-text-muted)]">
              No authors found. Authors are created when posts are published.
            </p>
          </div>
        )}
      </section>

      {/* Latest posts */}
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xl font-bold text-[var(--blog-text)] mb-6">
          Latest Articles
        </h2>
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-4 hover:border-[var(--blog-accent)] transition-colors"
            >
              <div className="min-w-0">
                <h3 className="font-medium text-[var(--blog-text)] group-hover:text-[var(--blog-accent)] transition-colors truncate">
                  {post.title}
                </h3>
                <p className="mt-1 text-sm text-[var(--blog-text-muted)] line-clamp-1">
                  {post.description}
                </p>
              </div>
              <time
                dateTime={post.published}
                className="text-sm text-[var(--blog-text-muted)] whitespace-nowrap shrink-0"
              >
                {formatDate(post.published)}
              </time>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
