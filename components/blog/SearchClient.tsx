"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Clock } from "lucide-react";
import { SearchIndexItem, createFuseIndex, searchPosts } from "@/lib/blog/search";
import { formatDate } from "@/lib/blog/utils";
import { categorySlug } from "@/lib/blog/slugs";

interface SearchClientProps {
  posts: SearchIndexItem[];
  categories: { name: string; slug: string; count: number }[];
  tags: { name: string; slug: string; count: number }[];
}

function SearchResults({
  posts,
  categories,
  tags,
}: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialTag = searchParams.get("tag") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTag, setSelectedTag] = useState(initialTag);

  const fuse = useMemo(() => createFuseIndex(posts), [posts]);

  const results = useMemo(() => {
    const searchQuery = query.trim() || " ";
    return searchPosts(
      fuse,
      searchQuery,
      selectedCategory || undefined,
      selectedTag || undefined
    );
  }, [fuse, query, selectedCategory, selectedTag]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedTag) params.set("tag", selectedTag);

    const url = params.toString()
      ? `/blog/search?${params.toString()}`
      : "/blog/search";
    router.replace(url, { scroll: false });
  }, [query, selectedCategory, selectedTag, router]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-6 mb-8">
        <div className="relative">
          <input
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, essays, poems..."
            className="w-full rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] py-3 pl-12 pr-12 text-[var(--blog-text)] placeholder:text-[var(--blog-text-muted)] focus:border-[var(--blog-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--blog-accent)]/20"
          />
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--blog-text-muted)]" />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--blog-text-muted)] hover:text-[var(--blog-text)]"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] px-3 py-2 text-sm text-[var(--blog-text)] focus:border-[var(--blog-accent)] focus:outline-none"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name} ({category.count})
              </option>
            ))}
          </select>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] px-3 py-2 text-sm text-[var(--blog-text)] focus:border-[var(--blog-accent)] focus:outline-none"
          >
            <option value="">All tags</option>
            {tags.map((tag) => (
              <option key={tag.slug} value={tag.slug}>
                #{tag.name} ({tag.count})
              </option>
            ))}
          </select>

          <div className="ml-auto flex items-center gap-1 text-xs text-[var(--blog-text-muted)]">
            <Clock className="h-3.5 w-3.5" />
            <span>Press Ctrl+K to search</span>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--blog-text)]">
          {query.trim() || selectedCategory || selectedTag
            ? `${results.length} result${results.length !== 1 ? "s" : ""}`
            : `${posts.length} articles`}
        </h2>
      </div>

      <div className="space-y-4">
        {results.length > 0 ? (
          results.map(({ item, score }) => (
            <Link
              key={item.slug}
              href={`/blog/${item.slug}`}
              className="group block rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-5 hover:border-[var(--blog-accent)] transition-colors"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--blog-accent)]">
                <span className="rounded-full bg-[var(--blog-accent-light)] px-2 py-0.5 font-medium">
                  {item.category}
                </span>
                {score !== undefined && (
                  <span className="text-[var(--blog-text-muted)]">
                    relevance: {Math.round((1 - score) * 100)}%
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-xl font-semibold text-[var(--blog-text)] group-hover:text-[var(--blog-accent)] transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--blog-text-secondary)] line-clamp-2">
                {item.description}
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs text-[var(--blog-text-muted)]">
                <time dateTime={item.published}>
                  {formatDate(item.published)}
                </time>
                <span>·</span>
                <span>{item.readingTime} min read</span>
              </div>
              {item.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tags.slice(0, 5).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-[var(--blog-text-muted)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))
        ) : (
          <div className="rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-12 text-center">
            <p className="text-[var(--blog-text-secondary)]">
              No articles found matching your search.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export function SearchClient(props: SearchClientProps) {
  return (
    <Suspense
      fallback={
        <div className="rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-12 text-center">
          <p className="text-[var(--blog-text-secondary)]">Loading search...</p>
        </div>
      }
    >
      <SearchResults {...props} />
    </Suspense>
  );
}
