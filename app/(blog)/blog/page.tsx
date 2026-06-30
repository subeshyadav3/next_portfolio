import Link from "next/link";
import Image from "next/image";
import {
  getAllPosts,
  getFeaturedPost,
  getCategories,
  getTags,
} from "@/lib/blog/posts";
import { generateBlogMetadata } from "@/lib/blog/seo";
import { generateWebSiteSchema } from "@/lib/blog/schema";
import { formatDate } from "@/lib/blog/utils";
import { getPostsByCategory } from "@/lib/blog/posts";
import {
  getCategoryDescription,
  getCategoryAccent,
} from "@/lib/blog/categories";
import { BlogCard } from "@/components/blog/BlogCard";
import { CategoryCloud } from "@/components/blog/CategoryCloud";
import { TagCloud } from "@/components/blog/TagCloud";
import { SearchBox } from "@/components/blog/SearchBox";

export const metadata = generateBlogMetadata();

const POSTS_PER_PAGE = 10;

interface BlogHomePageProps {
  searchParams?: Promise<{ page?: string }>;
}

export default async function BlogHomePage({ searchParams }: BlogHomePageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params?.page || "1", 10) || 1);

  const posts = getAllPosts();
  const featured = getFeaturedPost();
  const categories = getCategories();
  const tags = getTags().slice(0, 20);

  const totalPosts = posts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const webSiteSchema = generateWebSiteSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />

      {/* Hero */}
      <section className="border-b border-[var(--blog-border)] bg-[var(--blog-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[var(--blog-text)] sm:text-5xl lg:text-6xl">
              Essay, Poems & Educational Notes
            </h1>
            <p className="mt-6 text-lg leading-8 text-[var(--blog-text-secondary)]">
              A growing collection of Nepali essays, poems, SEE and BLE practice
              questions, book reviews, and stories — curated for students and
              readers.
            </p>
            <div className="mt-8 flex justify-center">
              <SearchBox />
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--blog-text)] mb-6">
            Featured Article
          </h2>
          <Link
            href={`/blog/${featured.slug}`}
            className="group block overflow-hidden rounded-2xl border border-[var(--blog-border)] bg-[var(--blog-surface)] shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden bg-stone-100">
                {featured.image ? (
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900">
                    <span className="text-6xl">✍️</span>
                  </div>
                )}
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <span className="inline-flex w-fit items-center rounded-full bg-[var(--blog-accent-light)] px-3 py-1 text-xs font-medium text-[var(--blog-accent)]">
                  {featured.category}
                </span>
                <h3 className="mt-4 text-2xl font-bold text-[var(--blog-text)] group-hover:text-[var(--blog-accent)] transition-colors lg:text-3xl">
                  {featured.title}
                </h3>
                <p className="mt-4 text-[var(--blog-text-secondary)] line-clamp-3">
                  {featured.description}
                </p>
                <div className="mt-6 flex items-center gap-4 text-sm text-[var(--blog-text-muted)]">
                  <time dateTime={featured.published}>
                    {formatDate(featured.published)}
                  </time>
                  <span>·</span>
                  <span>{featured.readingTime} min read</span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <CategoryCloud categories={categories.slice(0, 8)} />
      </section>

      {/* Browse by Category */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[var(--blog-text)] mb-8">
          Browse by Category
        </h2>
        <div className="space-y-12">
          {categories.slice(0, 6).map((category) => {
            const postsInCategory = getPostsByCategory(category.slug).slice(
              0,
              3
            );
            return (
              <div key={category.slug}>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--blog-text)]">
                      {category.name}
                    </h3>
                    <p
                      className="mt-1 text-sm text-[var(--blog-text-secondary)] max-w-2xl"
                      style={{ color: getCategoryAccent(category.slug) }}
                    >
                      {getCategoryDescription(category.slug)}
                    </p>
                  </div>
                  <Link
                    href={`/blog/category/${category.slug}`}
                    className="text-sm font-medium hover:underline shrink-0"
                    style={{ color: getCategoryAccent(category.slug) }}
                  >
                    View all {category.count} articles →
                  </Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {postsInCategory.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* All Articles - Paginated */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-[var(--blog-border)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--blog-text)]">
            All Articles
          </h2>
          <span className="text-sm text-[var(--blog-text-muted)]">
            Page {currentPage} of {totalPages} ({totalPosts} posts)
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className="mt-12 flex items-center justify-center gap-2"
            aria-label="Pagination"
          >
            <Link
              href={currentPage > 2 ? `/blog?page=${currentPage - 1}` : "/blog"}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                currentPage === 1
                  ? "pointer-events-none border-[var(--blog-border)] text-[var(--blog-text-muted)] opacity-50"
                  : "border-[var(--blog-border)] text-[var(--blog-text-secondary)] hover:border-[var(--blog-accent)] hover:text-[var(--blog-accent)]"
              }`}
            >
              ← Previous
            </Link>

            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Link
                    key={page}
                    href={page === 1 ? "/blog" : `/blog?page=${page}`}
                    className={`min-w-[2.5rem] rounded-lg px-3 py-2 text-sm font-medium text-center transition-colors ${
                      page === currentPage
                        ? "bg-[var(--blog-accent)] text-white"
                        : "text-[var(--blog-text-secondary)] hover:bg-[var(--blog-surface)]"
                    }`}
                    aria-current={page === currentPage ? "page" : undefined}
                  >
                    {page}
                  </Link>
                )
              )}
            </div>

            <span className="sm:hidden text-sm text-[var(--blog-text-muted)]">
              {currentPage} / {totalPages}
            </span>

            <Link
              href={`/blog?page=${currentPage + 1}`}
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
      </section>

      {/* Tags */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <TagCloud tags={tags} />
      </section>

      {/* Newsletter */}
    </>
  );
}
