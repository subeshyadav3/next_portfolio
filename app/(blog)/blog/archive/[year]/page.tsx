import { notFound } from "next/navigation";
import Link from "next/link";
import { getArchiveYears, getPostsByYear } from "@/lib/blog/posts";
import { generateArchiveMetadata } from "@/lib/blog/seo";
import { SITE_URL } from "@/lib/site-config";
import { generateBreadcrumbSchema } from "@/lib/blog/schema";
import { BlogCard } from "@/components/blog/BlogCard";
import { Breadcrumb } from "@/components/blog/Breadcrumb";

const POSTS_PER_PAGE = 10;

interface PageProps {
  params: Promise<{ year: string }>;
  searchParams?: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  return (await getArchiveYears()).map((archive) => ({ year: archive.year }));
}

export async function generateMetadata({ params }: PageProps) {
  const { year } = await params;
  return generateArchiveMetadata(year);
}

export default async function ArchivePage({ params, searchParams }: PageProps) {
  const { year } = await params;
  const sp = await searchParams;
  const currentPage = Math.max(1, parseInt(sp?.page || "1", 10) || 1);
  const archives = await getArchiveYears();
  const archive = archives.find((a) => a.year === year);

  if (!archive) {
    notFound();
  }

  const allPosts = await getPostsByYear(year);
  const totalPosts = allPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
  const paginatedPosts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  function pageHref(page: number): string {
    const base = `/blog/archive/${year}`;
    return page <= 1 ? base : `${base}?page=${page}`;
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: year, url: `${SITE_URL}/blog/archive/${year}` },
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
            { label: year, href: `/blog/archive/${year}` },
          ]}
        />

        <div className="mt-8">
          <h1 className="text-4xl font-bold text-[var(--blog-text)]">
            Archive {year}
          </h1>
          <p className="mt-3 text-lg text-[var(--blog-text-secondary)]">
            {totalPosts} article{totalPosts !== 1 ? "s" : ""} published in {year}.
          </p>
        </div>
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
              No articles found for this year.
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
