import Link from "next/link";
import Image from "next/image";
import {
  getAllPosts,
  getFeaturedPost,
  getCategories,
} from "@/lib/blog/posts";
import { generateBlogMetadata } from "@/lib/blog/seo";
import { generateWebSiteSchema, generateOrganizationSchema } from "@/lib/blog/schema";
import { formatDate } from "@/lib/blog/utils";
import { getCategorySlug, getCategoryAccent } from "@/lib/blog/categories";
import { BlogCard } from "@/components/blog/BlogCard";
import { CategoryCloud } from "@/components/blog/CategoryCloud";
import { SearchBox } from "@/components/blog/SearchBox";
import { BlogPagination } from "@/components/blog/BlogPagination";
import type { NormalizedPostSummary } from "@/lib/content";
import { Suspense } from "react";
import { Sparkles, ArrowRight, BookOpen, Flame, Compass } from "lucide-react";

export const metadata = generateBlogMetadata();
export const revalidate = 3600;

const POSTS_PER_PAGE = 10;

const QUICK_TOPICS = [
  { label: "Nepali Essays", href: "/blog/category/essays" },
  { label: "Poems & Poetry", href: "/blog/category/poems" },
  { label: "SEE / BLE Notes", href: "/blog/category/class-10" },
  { label: "Shayari & Gajal", href: "/blog/category/shayari" },
  { label: "Stories", href: "/blog/category/stories" },
  { label: "Book Reviews", href: "/blog/category/reviews" },
];

export default async function BlogHomePage() {
  const [posts, featured, categories] = await Promise.all([
    getAllPosts(),
    getFeaturedPost(),
    getCategories(),
  ]);

  // Build an in-memory category → posts map so we don't query per category.
  const postsByCategory = new Map<string, NormalizedPostSummary[]>();
  for (const post of posts) {
    const slug = getCategorySlug(post.category);
    const existing = postsByCategory.get(slug);
    if (existing) {
      existing.push(post);
    } else {
      postsByCategory.set(slug, [post]);
    }
  }

  const webSiteSchema = generateWebSiteSchema();
  const organizationSchema = generateOrganizationSchema();

  return (
    <div className="space-y-16 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* ── Editorial Hero ── */}
      <section className="relative overflow-hidden border-b border-[var(--blog-border)] bg-gradient-to-b from-[var(--blog-surface)] to-[var(--blog-bg)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--blog-accent)]/20 bg-[var(--blog-accent)]/10 px-4 py-1 text-xs font-semibold text-[var(--blog-accent)] mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Neb Master · Literature, Essays & Exam Archive
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--blog-text)] sm:text-5xl lg:text-6xl lg:leading-[1.12]">
              Essays, Literature &amp; Study Notes
            </h1>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-[var(--blog-text-secondary)]">
              Curated Nepali essays, poems, SEE &amp; BLE preparation questions, book reviews,
              and academic guides — written for students, readers, and curious minds.
            </p>

            <div className="mt-8 flex justify-center">
              <SearchBox />
            </div>

            {/* Quick Filter Chips */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--blog-text-muted)] mr-1">
                Explore:
              </span>
              {QUICK_TOPICS.map((topic) => (
                <Link
                  key={topic.label}
                  href={topic.href}
                  className="rounded-full border border-[var(--blog-border)] bg-[var(--blog-surface)] px-3 py-1 text-xs font-medium text-[var(--blog-text-secondary)] transition-all hover:border-[var(--blog-accent)] hover:text-[var(--blog-accent)] hover:shadow-2xs"
                >
                  {topic.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Magazine Article ── */}
      {featured && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--blog-text)]">
              Featured Selection
            </h2>
          </div>

          <Link
            href={`/blog/${featured.slug}`}
            className="group block overflow-hidden rounded-3xl border border-[var(--blog-border)] bg-[var(--blog-surface)] shadow-sm transition-all duration-300 hover:border-[var(--blog-accent)]/40 hover:shadow-xl"
          >
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden bg-[var(--blog-surface2)]">
                {featured.image ? (
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/40 dark:to-slate-900 text-indigo-400 p-8">
                    <BookOpen className="h-16 w-16 opacity-40" />
                  </div>
                )}
              </div>

              <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${getCategoryAccent(getCategorySlug(featured.category))} 15%, transparent)`,
                      color: getCategoryAccent(getCategorySlug(featured.category)),
                    }}
                  >
                    {featured.category}
                  </span>
                  <span className="text-xs text-[var(--blog-text-muted)]">
                    Editor's Pick
                  </span>
                </div>

                <h3 className="mt-4 text-2xl font-bold text-[var(--blog-text)] transition-colors group-hover:text-[var(--blog-accent)] lg:text-3xl lg:leading-snug">
                  {featured.title}
                </h3>

                <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-[var(--blog-text-secondary)] line-clamp-3">
                  {featured.description}
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-between border-t border-[var(--blog-border)] pt-4 text-xs text-[var(--blog-text-muted)]">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[var(--blog-text)]">{featured.author}</span>
                    <span>·</span>
                    <time dateTime={featured.published}>
                      {formatDate(featured.published)}
                    </time>
                    <span>·</span>
                    <span>{featured.readingTime} min read</span>
                  </div>

                  <span className="inline-flex items-center gap-1 font-semibold text-[var(--blog-accent)] transition-transform group-hover:translate-x-1">
                    Read Story <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ── All Categories Explorer ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-4">
          <Compass className="h-5 w-5 text-[var(--blog-accent)]" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--blog-text)]">
            Browse by Topic
          </h2>
        </div>
        <CategoryCloud categories={categories.slice(0, 8)} />
      </section>

      {/* ── Category Highlights ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
        {categories.slice(0, 5).map((category, catIdx) => {
          const postsInCategory = (postsByCategory.get(category.slug) ?? []).slice(0, 3);
          if (postsInCategory.length === 0) return null;

          const accent = getCategoryAccent(category.slug);

          return (
            <div key={category.slug} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-[var(--blog-border)] pb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: accent }}
                  />
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--blog-text)]">
                    {category.name}
                  </h3>
                </div>
                <Link
                  href={`/blog/category/${category.slug}`}
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold transition-transform hover:translate-x-1"
                  style={{ color: accent }}
                >
                  View all {category.count} {category.name} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {postsInCategory.map((post, postIdx) => (
                  <BlogCard
                    key={post.slug}
                    post={post}
                    priority={catIdx === 0 && postIdx === 0}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* ── All Articles Feed (Paginated) ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-[var(--blog-border)] pt-12">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--blog-text)]">
              All Articles Archive
            </h2>
            <p className="mt-1 text-sm text-[var(--blog-text-secondary)]">
              Browse through our complete collection of {posts.length} published essays and study guides.
            </p>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse rounded-2xl bg-[var(--blog-surface)] border border-[var(--blog-border)]"
                />
              ))}
            </div>
          }
        >
          <BlogPagination posts={posts} postsPerPage={POSTS_PER_PAGE} />
        </Suspense>
      </section>
    </div>
  );
}
