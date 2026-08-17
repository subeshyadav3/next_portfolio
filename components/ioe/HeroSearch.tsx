"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, X, BookOpen, ArrowRight, Sparkles, FileText } from "lucide-react";
import { getSubjectSlugFromName } from "@/lib/ioe/data";

interface SearchSubjectItem {
  name: string;
  papersCount: number;
}

interface HeroSearchProps {
  subjects: SearchSubjectItem[];
}

const POPULAR_QUICK_TAGS = [
  "Engineering Mathematics",
  "Applied Mechanics",
  "Object Oriented Programming",
  "Data Structure",
  "Database Management",
  "Microprocessor",
  "Control System",
];

export function HeroSearch({ subjects }: HeroSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return subjects
      .filter((s) => s.name.toLowerCase().includes(q))
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
          placeholder="Search subjects or topics… (e.g. 'mechanics', 'database', 'math')"
          className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-10 text-sm sm:text-base font-medium text-slate-900 shadow-xs placeholder:text-slate-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-gray-800 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-gray-800 dark:bg-gray-900">
          {filtered.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Matching Subjects ({filtered.length})
              </div>
              {filtered.map((item) => {
                const slug = getSubjectSlugFromName(item.name);
                return (
                  <Link
                    key={item.name}
                    href={`/ioe/subjects/${slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-colors hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BookOpen className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                      <span className="truncate font-medium text-slate-800 dark:text-slate-200">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-gray-800 dark:text-slate-400">
                        <FileText className="h-2.5 w-2.5" />
                        {item.papersCount} {item.papersCount === 1 ? "paper" : "papers"}
                      </span>
                      <ArrowRight className="h-3 w-3 text-slate-400" />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
              No subjects found matching &ldquo;{query}&rdquo;. Check the{" "}
              <Link href="/ioe/all" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
                All Subjects Archive
              </Link>
              .
            </div>
          )}
        </div>
      )}

      {/* Quick Search Chips */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
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
            className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 shadow-xs transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
