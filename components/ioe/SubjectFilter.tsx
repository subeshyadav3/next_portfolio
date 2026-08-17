"use client";

import { useState } from "react";
import { Search, X, Sparkles } from "lucide-react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function SubjectFilter({ availableLetters = [] }: { availableLetters?: string[] }) {
  const [query, setQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const handleFilter = (val: string) => {
    setQuery(val);
    setActiveLetter(null);
    const q = val.trim().toLowerCase();
    let visibleCount = 0;

    for (const link of document.querySelectorAll<HTMLElement>("[data-subject-link]")) {
      const match = link.textContent?.toLowerCase().includes(q) ?? false;
      link.style.display = match ? "" : "none";
      if (match) visibleCount++;
    }

    // Hide or show letter section headers
    for (const sec of document.querySelectorAll<HTMLElement>("[data-letter-section]")) {
      const visibleChildren = sec.querySelectorAll<HTMLElement>("[data-subject-link]:not([style*='display: none'])");
      sec.style.display = visibleChildren.length > 0 ? "" : "none";
    }

    const countEl = document.getElementById("filtered-subject-count");
    if (countEl) {
      countEl.textContent = q ? `${visibleCount} subjects matching "${q}"` : "";
    }
  };

  const handleLetterClick = (letter: string) => {
    if (activeLetter === letter) {
      setActiveLetter(null);
      handleFilter("");
      return;
    }
    setActiveLetter(letter);
    setQuery("");
    let visibleCount = 0;

    for (const link of document.querySelectorAll<HTMLElement>("[data-subject-link]")) {
      const subjectName = (link.getAttribute("data-subject-name") ?? "").trim().toUpperCase();
      const match = subjectName.startsWith(letter);
      link.style.display = match ? "" : "none";
      if (match) visibleCount++;
    }

    for (const sec of document.querySelectorAll<HTMLElement>("[data-letter-section]")) {
      const secLetter = sec.getAttribute("data-letter-section");
      sec.style.display = secLetter === letter ? "" : "none";
    }

    const countEl = document.getElementById("filtered-subject-count");
    if (countEl) {
      countEl.textContent = `${visibleCount} subjects starting with "${letter}"`;
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="search"
          value={query}
          onChange={(e) => handleFilter(e.target.value)}
          placeholder="Filter subjects in real-time… (e.g. 'database', 'mechanics', 'signal', 'math')"
          className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-10 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => handleFilter("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-gray-800 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* A-Z Letter Jump Pills */}
      <div className="flex flex-wrap items-center gap-1">
        <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Jump:
        </span>
        {ALPHABET.map((char) => {
          const isAvailable = availableLetters.includes(char);
          const isSelected = activeLetter === char;
          return (
            <button
              key={char}
              type="button"
              disabled={!isAvailable}
              onClick={() => handleLetterClick(char)}
              className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${
                isSelected
                  ? "bg-blue-600 text-white shadow-xs dark:bg-blue-500"
                  : isAvailable
                    ? "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:bg-gray-800 dark:text-slate-300 dark:hover:bg-gray-700 dark:hover:text-white"
                    : "cursor-not-allowed opacity-25 text-slate-400 dark:text-slate-600"
              }`}
            >
              {char}
            </button>
          );
        })}
      </div>
    </div>
  );
}