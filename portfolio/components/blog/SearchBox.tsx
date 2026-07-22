"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/blog/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles..."
        className="w-full rounded-full border border-[var(--blog-border)] bg-[var(--blog-surface)] py-3 pl-12 pr-4 text-[var(--blog-text)] placeholder:text-[var(--blog-text-muted)] focus:border-[var(--blog-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--blog-accent)]/20 transition-all"
      />
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--blog-text-muted)]" />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[var(--blog-accent)] px-4 py-1.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
      >
        Search
      </button>
    </form>
  );
}
