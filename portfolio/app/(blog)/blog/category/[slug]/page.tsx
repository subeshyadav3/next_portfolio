import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCategories, getPostsByCategory } from "@/lib/blog/posts";
import { generateCategoryMetadata } from "@/lib/blog/seo";
import { getCategoryAccent, getCategoryDescription } from "@/lib/blog/categories";
import { SITE_URL } from "@/lib/site-config";
import { generateBreadcrumbSchema } from "@/lib/blog/schema";
import { BlogCard } from "@/components/blog/BlogCard";
import { Breadcrumb } from "@/components/blog/Breadcrumb";

export const revalidate = 3600;

const POSTS_PER_PAGE = 10;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  return (await getCategories()).map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};
  return generateCategoryMetadata(category);
}

const OLD_SLUG_REDIRECTS: Record<string, string> = {
  see: "class-10",
  ble: "class-8",
  "class-10-see": "class-10",
  "class-8-ble": "class-8",
};

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;

  if (OLD_SLUG_REDIRECTS[slug]) {
    redirect(`/blog/category/${OLD_SLUG_REDIRECTS[slug]}`);
  }

  const sp = await searchParams;
  const currentPage = Math.max(1, parseInt(sp?.page || "1", 10) || 1);
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const allPosts = await getPostsByCategory(slug);
  const totalPosts = allPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
  const paginatedPosts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  function pageHref(page: number): string {
    const base = `/blog/category/${category.slug}`;
    return page <= 1 ? base : `${base}?page=${page}`;
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: category.name, url: `${SITE_URL}/blog/category/${category.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Blog", href: "/blog" },
            { label: category.name, href: `/blog/category/${category.slug}` },
          ]}
        />

        <header className="mt-8">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold"
            style={{
              backgroundColor: `color-mix(in srgb, ${getCategoryAccent(category.slug)} 15%, transparent)`,
              color: getCategoryAccent(category.slug),
            }}
          >
            {category.name}
          </span>
          <h1 className="mt-4 text-4xl font-bold text-[var(--blog-text)]">
            {category.name} Articles
          </h1>
          <p className="mt-3 text-lg text-[var(--blog-text-secondary)] max-w-3xl">
            {getCategoryDescription(category.slug)}
          </p>
          <p className="mt-2 text-sm text-[var(--blog-text-muted)]">
            {totalPosts} article{totalPosts !== 1 ? "s" : ""} in this category.
          </p>
        </header>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {paginatedPosts.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
                <Link
                  href={pageHref(currentPage - 1)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? "pointer-events-none border-[var(--blog-border)] text-[var(--blog-text-muted)] opacity-50"
                      : "border-[var(--blog-border)] text-[var(--blog-text-secondary)] hover:border-[var(--blog-accent)] hover:text-[var(--blog-accent)]"
                  }`}
                >
                  ← Previous
                </Link>

                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Link
                      key={page}
                      href={pageHref(page)}
                      className={`min-w-[2.5rem] rounded-lg px-3 py-2 text-sm font-medium text-center transition-colors ${
                        page === currentPage
                          ? "bg-[var(--blog-accent)] text-white"
                          : "text-[var(--blog-text-secondary)] hover:bg-[var(--blog-surface)]"
                      }`}
                      aria-current={page === currentPage ? "page" : undefined}
                    >
                      {page}
                    </Link>
                  ))}
                </div>

                <span className="sm:hidden text-sm text-[var(--blog-text-muted)]">
                  {currentPage} / {totalPages}
                </span>

                <Link
                  href={pageHref(currentPage + 1)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? "pointer-events-none border-[var(--blog-border)] text-[var(--blog-text-muted)] opacity-50"
                      : "border-[var(--blog-border)] text-[var(--blog-text-secondary)] hover:border-[var(--blog-accent)] hover:text-[var(--blog-accent)]"
                  }`}
                >
                  Next →
                </Link>
              </nav>
            )}
          </>
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
    </>
  );
}
