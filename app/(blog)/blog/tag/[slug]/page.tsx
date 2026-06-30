import { notFound } from "next/navigation";
import Link from "next/link";
import { getTags, getPostsByTag } from "@/lib/blog/posts";
import { generateTagMetadata } from "@/lib/blog/seo";
import { BlogCard } from "@/components/blog/BlogCard";
import { Breadcrumb } from "@/components/blog/Breadcrumb";
import { Newsletter } from "@/components/blog/Newsletter";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getTags().map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const tags = getTags();
  const tag = tags.find((t) => t.slug === slug);
  if (!tag) return {};
  return generateTagMetadata(tag);
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const tags = getTags();
  const tag = tags.find((t) => t.slug === slug);

  if (!tag) {
    notFound();
  }

  const posts = getPostsByTag(tag.name);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Blog", href: "/blog" },
            { label: `#${tag.name}`, href: `/blog/tag/${tag.slug}` },
          ]}
        />

        <div className="mt-8">
          <span className="inline-flex items-center rounded-full bg-[var(--blog-accent-light)] px-3 py-1 text-sm font-medium text-[var(--blog-accent)]">
            Tag
          </span>
          <h1 className="mt-4 text-4xl font-bold text-[var(--blog-text)]">
            #{tag.name}
          </h1>
          <p className="mt-3 text-lg text-[var(--blog-text-secondary)]">
            {posts.length} article{posts.length !== 1 ? "s" : ""} tagged with #{tag.name}.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-12 text-center">
            <p className="text-[var(--blog-text-secondary)]">
              No articles found with this tag yet.
            </p>
            <Link
              href="/blog"
              className="mt-4 inline-block text-[var(--blog-accent)] hover:underline"
            >
              Back to blog home
            </Link>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Newsletter />
      </section>
    </>
  );
}
