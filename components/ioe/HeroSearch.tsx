"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, BookOpen, ArrowRight, Sparkles, FileText, Flame } from "lucide-react";
import { getSubjectSlugFromName } from "@/lib/ioe/data";

export interface SearchSubjectItem {
  name: string;
  papersCount: number;
  primaryPath?: string;
  hasQuestionBank?: boolean;
  programs?: string[];
}

interface HeroSearchProps {
  subjects: SearchSubjectItem[];
}

const POPULAR_QUICK_TAGS = [
  "Engineering Mathematics",
  "Engineering Physics",
  "Applied Mechanics",
  "Computer Programming",
  "Data Structure",
  "Database Management",
  "Fluid Mechanics",
];

export function HeroSearch({ subjects }: HeroSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const terms = q.split(/\s+/).filter(Boolean);
    return subjects
      .filter((s) => {
        const hay = `${s.name} ${(s.programs ?? []).join(" ")}`.toLowerCase();
        return terms.every((t) => hay.includes(t));
      })
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(q) ? 1 : 0;
        const bStarts = b.name.toLowerCase().startsWith(q) ? 1 : 0;
        if (aStarts !== bStarts) return bStarts - aStarts;
        return Number(Boolean(b.hasQuestionBank)) - Number(Boolean(a.hasQuestionBank));
      })
      .slice(0, 8);
  }, [subjects, query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTargetHref = (item: SearchSubjectItem) =>
    item.primaryPath || `/ioe/subjects/${getSubjectSlugFromName(item.name)}`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" && filtered.length > 0) {
      e.preventDefault();
      setIsOpen(false);
      router.push(getTargetHref(filtered[0]));
    }
  };

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-2xl text-left">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search any subject or code… (e.g. 'mathematics', 'database', 'BCT S3')"
          className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-10 text-sm font-medium text-slate-900 shadow-xs placeholder:text-slate-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 sm:text-base"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            aria-label="Clear search"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-gray-800 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-gray-800 dark:bg-gray-900 sm:max-h-96">
          {filtered.length > 0 ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <span>Matching Subjects ({filtered.length})</span>
                <span className="hidden text-[10px] normal-case sm:inline">Press Enter to open top result</span>
              </div>
              {filtered.map((item) => {
                const href = getTargetHref(item);
                return (
                  <Link
                    key={item.name}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                        <span className="truncate font-semibold text-slate-800 dark:text-slate-200">
                          {item.name}
                        </span>
                      </div>
                      {item.programs && item.programs.length > 0 && (
                        <div className="mt-1 flex flex-wrap items-center gap-1 pl-6">
                          {item.programs.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:bg-gray-800 dark:text-slate-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {item.hasQuestionBank && (
                        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                          <Flame className="h-2.5 w-2.5" />
                          PYQ Bank
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-gray-800 dark:text-slate-400">
                        <FileText className="h-2.5 w-2.5" />
                        {item.papersCount}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
              No subjects found matching &ldquo;{query}&rdquo;. Browse the{" "}
              <Link href="/ioe/all" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
                All Subjects Archive
              </Link>
              .
            </div>
          )}
        </div>
      )}

      {/* Quick Search Chips */}
      <div className="mt-3 flex flex-nowrap items-center justify-start gap-1.5 overflow-x-auto pb-1 text-xs text-slate-500 scrollbar-none dark:text-slate-400 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
        <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
          <Sparkles className="h-3 w-3 text-blue-500" />
          Popular:
        </span>
        {POPULAR_QUICK_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => {
              setQuery(tag);
              setIsOpen(true);
            }}
            className="shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-2xs transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-gray-800 dark:hover:text-white sm:py-0.5"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
