import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategories, getPostsByCategory } from "@/lib/blog/posts";
import { generateCategoryMetadata } from "@/lib/blog/seo";
import { BlogCard } from "@/components/blog/BlogCard";
import { Breadcrumb } from "@/components/blog/Breadcrumb";
import { Newsletter } from "@/components/blog/Newsletter";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getCategories().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const categories = getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};
  return generateCategoryMetadata(category);
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const categories = getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const posts = getPostsByCategory(slug);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Blog", href: "/blog" },
            { label: category.name, href: `/blog/category/${category.slug}` },
          ]}
        />

        <div className="mt-8">
          <h1 className="text-4xl font-bold text-[var(--blog-text)]">
            {category.name}
          </h1>
          <p className="mt-3 text-lg text-[var(--blog-text-secondary)]">
            {posts.length} article{posts.length !== 1 ? "s" : ""} in this
            category.
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
              No articles found in this category yet.
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
