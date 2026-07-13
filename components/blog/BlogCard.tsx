import Link from "next/link";
import Image from "next/image";
import type { NormalizedPostSummary } from "@/lib/content";
import { formatDate } from "@/lib/blog/utils";
import { getCategorySlug, getCategoryLabel, getCategoryAccent } from "@/lib/blog/categories";

interface BlogCardProps {
  post: NormalizedPostSummary;
  /** Set true for the first/above-the-fold card to prioritize LCP. */
  priority?: boolean;
}

export function BlogCard({ post, priority = false }: BlogCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] shadow-sm hover:shadow-md transition-all duration-300">
      <Link
        href={`/blog/${post.slug}`}
        className="relative aspect-[16/10] overflow-hidden bg-stone-100"
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
          <Image
            src="/images/blog-placeholder.svg"
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link
          href={`/blog/category/${getCategorySlug(post.category)}`}
          className="inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium hover:opacity-80 transition-opacity"
          style={{
            backgroundColor: `color-mix(in srgb, ${getCategoryAccent(getCategorySlug(post.category))} 15%, transparent)`,
            color: getCategoryAccent(getCategorySlug(post.category)),
          }}
        >
          {getCategoryLabel(getCategorySlug(post.category))}
        </Link>

        <h3 className="mt-3 text-lg font-semibold leading-snug text-[var(--blog-text)] group-hover:text-[var(--blog-accent)] transition-colors line-clamp-2">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--blog-text-secondary)] line-clamp-3">
          {post.description}
        </p>

        <div className="mt-4 flex items-center gap-3 text-xs text-[var(--blog-text-muted)]">
          <Link
            href={`/blog/author/${post.authorSlug}`}
            className="hover:text-[var(--blog-accent)] transition-colors"
          >
            {post.author}
          </Link>
          <span>·</span>
          <time dateTime={post.published}>{formatDate(post.published)}</time>
          <span>·</span>
          <span>{post.readingTime} min read</span>
        </div>
      </div>
    </article>
  );
}
