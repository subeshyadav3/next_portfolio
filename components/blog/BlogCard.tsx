import Link from "next/link";
import Image from "next/image";
import type { NormalizedPostSummary } from "@/lib/content";
import { formatDate } from "@/lib/blog/utils";
import { getCategorySlug, getCategoryLabel, getCategoryAccent } from "@/lib/blog/categories";
import { Clock } from "lucide-react";

interface BlogCardProps {
  post: NormalizedPostSummary;
  /** Set true for the first/above-the-fold card to prioritize LCP. */
  priority?: boolean;
}

export function BlogCard({ post, priority = false }: BlogCardProps) {
  const categorySlug = getCategorySlug(post.category);
  const categoryLabel = getCategoryLabel(categorySlug);
  const categoryAccent = getCategoryAccent(categorySlug);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--blog-border)] bg-[var(--blog-surface)] shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[var(--blog-accent)]/40 hover:shadow-lg">
      <Link
        href={`/blog/${post.slug}`}
        className="relative aspect-[16/10] overflow-hidden bg-[var(--blog-surface2)] block"
      >
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-900 dark:to-stone-800 text-stone-400">
            <span className="text-sm font-semibold tracking-wider uppercase opacity-60">
              {categoryLabel}
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/blog/category/${categorySlug}`}
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-opacity hover:opacity-80"
            style={{
              backgroundColor: `color-mix(in srgb, ${categoryAccent} 15%, transparent)`,
              color: categoryAccent,
            }}
          >
            {categoryLabel}
          </Link>
          <div className="flex items-center gap-1 text-[11px] font-medium text-[var(--blog-text-muted)]">
            <Clock className="h-3 w-3" />
            <span>{post.readingTime} min</span>
          </div>
        </div>

        <h3 className="mt-3.5 text-base sm:text-lg font-bold leading-snug text-[var(--blog-text)] transition-colors group-hover:text-[var(--blog-accent)] line-clamp-2">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        <p className="mt-2 flex-1 text-xs sm:text-sm leading-relaxed text-[var(--blog-text-secondary)] line-clamp-3">
          {post.description}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-[var(--blog-border)] pt-3.5 text-xs text-[var(--blog-text-muted)]">
          <Link
            href={`/blog/author/${post.authorSlug}`}
            className="font-medium hover:text-[var(--blog-accent)] transition-colors"
          >
            {post.author}
          </Link>
          <time dateTime={post.published}>{formatDate(post.published)}</time>
        </div>
      </div>
    </article>
  );
}
