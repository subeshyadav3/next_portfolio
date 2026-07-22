"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { NormalizedPostSummary } from "@/lib/content";
import { BlogCard } from "./BlogCard";

interface BlogPaginationProps {
  posts: NormalizedPostSummary[];
  postsPerPage: number;
}

export function BlogPagination({ posts, postsPerPage }: BlogPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Math.max(
    1,
    parseInt(searchParams.get("page") || "1", 10) || 1
  );
  const totalPosts = posts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / postsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedPosts = useMemo(() => {
    const start = (safePage - 1) * postsPerPage;
    return posts.slice(start, start + postsPerPage);
  }, [posts, safePage, postsPerPage]);

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[var(--blog-text)]">
          All Articles
        </h2>
        <span className="text-sm text-[var(--blog-text-muted)]">
          Page {safePage} of {totalPages} ({totalPosts} posts)
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav
          className="mt-12 flex items-center justify-center gap-2"
          aria-label="Pagination"
        >
          <button
            type="button"
            onClick={() => setPage(safePage - 1)}
            disabled={safePage === 1}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              safePage === 1
                ? "pointer-events-none border-[var(--blog-border)] text-[var(--blog-text-muted)] opacity-50"
                : "border-[var(--blog-border)] text-[var(--blog-text-secondary)] hover:border-[var(--blog-accent)] hover:text-[var(--blog-accent)]"
            }`}
          >
            ← Previous
          </button>

          <div className="hidden sm:flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setPage(page)}
                className={`min-w-[2.5rem] rounded-lg px-3 py-2 text-sm font-medium text-center transition-colors ${
                  page === safePage
                    ? "bg-[var(--blog-accent)] text-white"
                    : "text-[var(--blog-text-secondary)] hover:bg-[var(--blog-surface)]"
                }`}
                aria-current={page === safePage ? "page" : undefined}
              >
                {page}
              </button>
            ))}
          </div>

          <span className="sm:hidden text-sm text-[var(--blog-text-muted)]">
            {safePage} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setPage(safePage + 1)}
            disabled={safePage === totalPages}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              safePage === totalPages
                ? "pointer-events-none border-[var(--blog-border)] text-[var(--blog-text-muted)] opacity-50"
                : "border-[var(--blog-border)] text-[var(--blog-text-secondary)] hover:border-[var(--blog-accent)] hover:text-[var(--blog-accent)]"
            }`}
          >
            Next →
          </button>
        </nav>
      )}
    </>
  );
}
