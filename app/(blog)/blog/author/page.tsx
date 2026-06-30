import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog/posts";
import { formatDate } from "@/lib/blog/utils";
import { Breadcrumb } from "@/components/blog/Breadcrumb";
import { Newsletter } from "@/components/blog/Newsletter";

export const metadata: Metadata = {
  title: "Author | Subesh Yadav Blog",
  description:
    "Meet Subesh Yadav, the author behind essays, poems, and educational content for Nepali students.",
};

export default function AuthorPage() {
  const posts = getAllPosts();
  const postCount = posts.length;
  const categories = new Set(posts.map((p) => p.category)).size;

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Blog", href: "/blog" },
            { label: "Author", href: "/blog/author" },
          ]}
        />

        <div className="mt-8 rounded-2xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--blog-accent-light)] text-4xl font-bold text-[var(--blog-accent)]">
              SY
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[var(--blog-text)] sm:text-4xl">
                Subesh Yadav
              </h1>
              <p className="mt-2 text-lg text-[var(--blog-text-secondary)]">
                Full Stack Developer, Educator & Content Creator
              </p>
              <p className="mt-4 max-w-2xl text-[var(--blog-text-secondary)] leading-relaxed">
                I write essays, poems, study notes, and exam preparation
                materials for Nepali students. This blog covers SEE/BLB practice
                questions, Nepali literature, book reviews, and general
                knowledge — all curated to help learners succeed.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <a
                  href="https://github.com/subeshyadav3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-[var(--blog-accent)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/subeshyadav"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] px-5 py-2.5 text-sm font-medium text-[var(--blog-text)] hover:border-[var(--blog-accent)] transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[var(--blog-border)] pt-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--blog-text)]">
                {postCount}
              </div>
              <div className="text-sm text-[var(--blog-text-secondary)]">
                Articles
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--blog-text)]">
                {categories}
              </div>
              <div className="text-sm text-[var(--blog-text-secondary)]">
                Categories
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--blog-text)]">
                2018
              </div>
              <div className="text-sm text-[var(--blog-text-secondary)]">
                Writing since
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[var(--blog-text)] mb-6">
          Latest from the author
        </h2>
        <div className="space-y-4">
          {posts.slice(0, 10).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-4 hover:border-[var(--blog-accent)] transition-colors"
            >
              <div>
                <h3 className="font-medium text-[var(--blog-text)] group-hover:text-[var(--blog-accent)] transition-colors">
                  {post.title}
                </h3>
                <p className="mt-1 text-sm text-[var(--blog-text-muted)] line-clamp-1">
                  {post.description}
                </p>
              </div>
              <time
                dateTime={post.published}
                className="text-sm text-[var(--blog-text-muted)] whitespace-nowrap"
              >
                {formatDate(post.published)}
              </time>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Newsletter />
      </section>
    </>
  );
}
