import Link from "next/link";
import Image from "next/image";
import {
  getAllPosts,
  getFeaturedPost,
  getLatestPosts,
  getPopularPosts,
  getRecentlyUpdated,
  getCategories,
  getTags,
} from "@/lib/blog/posts";
import { generateBlogMetadata } from "@/lib/blog/seo";
import { generateWebSiteSchema } from "@/lib/blog/schema";
import { formatDate } from "@/lib/blog/utils";
import { categorySlug } from "@/lib/blog/slugs";
import { BlogCard } from "@/components/blog/BlogCard";
import { CategoryCloud } from "@/components/blog/CategoryCloud";
import { TagCloud } from "@/components/blog/TagCloud";
import { SearchBox } from "@/components/blog/SearchBox";

export const metadata = generateBlogMetadata();

export default function BlogHomePage() {
  const posts = getAllPosts();
  const featured = getFeaturedPost();
  const latest = getLatestPosts(6);
  const popular = getPopularPosts(6);
  const updated = getRecentlyUpdated(4);
  const categories = getCategories().slice(0, 8);
  const tags = getTags().slice(0, 20);

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
        <CategoryCloud categories={categories} />
      </section>

      {/* Latest */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--blog-text)]">
            Latest Articles
          </h2>
          <Link
            href="/blog/search"
            className="text-sm font-medium text-[var(--blog-accent)] hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* Popular */}
      {popular.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--blog-text)] mb-6">
            Popular Reads
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Updated */}
      {updated.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--blog-text)] mb-6">
            Recently Updated
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {updated.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex gap-4 rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-4 hover:border-[var(--blog-accent)] transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--blog-text)] group-hover:text-[var(--blog-accent)] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--blog-text-muted)]">
                    Updated {formatDate(post.updated)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Tags */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <TagCloud tags={tags} />
      </section>

      {/* Newsletter */}
    </>
  );
}
