"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export interface DisciplineOption {
  code: string;
  name: string;
  count?: number;
}

interface SubjectFilterProps {
  availableLetters?: string[];
  disciplines?: DisciplineOption[];
}

export function SubjectFilter({
  availableLetters = [],
  disciplines = [],
}: SubjectFilterProps) {
  const [query, setQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");

  const applyFilters = (searchVal: string, letterVal: string | null, discVal: string) => {
    const q = searchVal.trim().toLowerCase();
    let visibleCount = 0;

    for (const link of document.querySelectorAll<HTMLElement>("[data-subject-link]")) {
      const name = link.getAttribute("data-subject-name")?.toLowerCase() ?? "";
      const progs = (link.getAttribute("data-programs") ?? "").toLowerCase().split(",");

      // Check text query
      const matchQuery = !q || name.includes(q);

      // Check letter
      const matchLetter = !letterVal || name.trim().toUpperCase().startsWith(letterVal);

      // Check discipline
      const matchDisc = discVal === "all" || progs.includes(discVal.toLowerCase());

      const isVisible = matchQuery && matchLetter && matchDisc;
      link.style.display = isVisible ? "" : "none";
      if (isVisible) visibleCount++;
    }

    // Hide or show letter section headers
    for (const sec of document.querySelectorAll<HTMLElement>("[data-letter-section]")) {
      const visibleChildren = sec.querySelectorAll<HTMLElement>(
        "[data-subject-link]:not([style*='display: none'])"
      );
      sec.style.display = visibleChildren.length > 0 ? "" : "none";
    }

    const countEl = document.getElementById("filtered-subject-count");
    if (countEl) {
      if (q || letterVal || discVal !== "all") {
        const parts = [];
        if (discVal !== "all") parts.push(`in ${discVal.toUpperCase()}`);
        if (letterVal) parts.push(`starting with "${letterVal}"`);
        if (q) parts.push(`matching "${q}"`);
        countEl.textContent = `Showing ${visibleCount} subjects ${parts.join(" ")}`;
      } else {
        countEl.textContent = "";
      }
    }
  };

  const handleSearchChange = (val: string) => {
    setQuery(val);
    setActiveLetter(null);
    applyFilters(val, null, selectedDiscipline);
  };

  const handleDisciplineChange = (code: string) => {
    const newCode = selectedDiscipline === code ? "all" : code;
    setSelectedDiscipline(newCode);
    applyFilters(query, activeLetter, newCode);
  };

  const handleLetterClick = (letter: string) => {
    const newLetter = activeLetter === letter ? null : letter;
    setActiveLetter(newLetter);
    applyFilters(query, newLetter, selectedDiscipline);
  };

  const handleReset = () => {
    setQuery("");
    setActiveLetter(null);
    setSelectedDiscipline("all");
    applyFilters("", null, "all");
  };

  const hasActiveFilters = query !== "" || activeLetter !== null || selectedDiscipline !== "all";

  return (
    <div className="space-y-4">
      {/* ── Search Input ── */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="search"
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Filter subjects in real-time… (e.g. 'database', 'thermodynamics', 'chemical', 'math')"
          className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-10 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => handleSearchChange("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-gray-800 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Discipline Filter Pills ── */}
      {disciplines.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Filter by Engineering Discipline:
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Reset All Filters
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleDisciplineChange("all")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                selectedDiscipline === "all"
                  ? "bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-300 dark:hover:border-gray-700"
              }`}
            >
              All Disciplines
            </button>
            {disciplines.map((d) => {
              const isSelected = selectedDiscipline === d.code.toLowerCase();
              return (
                <button
                  key={d.code}
                  type="button"
                  onClick={() => handleDisciplineChange(d.code.toLowerCase())}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20 dark:bg-blue-500"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-300 dark:hover:border-blue-500/50 dark:hover:text-blue-400"
                  }`}
                >
                  <span>{d.code}</span>
                  <span
                    className={`hidden sm:inline font-normal text-[11px] ${
                      isSelected ? "text-blue-100" : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    ({d.name})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── A-Z Letter Jump Pills ── */}
      <div className="flex flex-wrap items-center gap-1 pt-1">
        <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Letter:
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