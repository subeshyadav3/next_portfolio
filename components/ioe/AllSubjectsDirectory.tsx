"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText, Flame, Search, X } from "lucide-react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export interface DirectorySubjectItem {
  name: string;
  primaryPath: string;
  papersCount: number;
  hasQuestionBank: boolean;
  programs: Array<{ code: string; semester: string }>;
}

export interface DisciplineOption {
  code: string;
  name: string;
}

interface AllSubjectsDirectoryProps {
  subjects: DirectorySubjectItem[];
  disciplines: DisciplineOption[];
}

export function AllSubjectsDirectory({
  subjects,
  disciplines,
}: AllSubjectsDirectoryProps) {
  const [query, setQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");
  const [onlyPyqBank, setOnlyPyqBank] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return subjects.filter((s) => {
      if (onlyPyqBank && !s.hasQuestionBank) return false;
      if (selectedDiscipline === "other") {
        if (s.programs.length > 0) return false;
      } else if (selectedDiscipline !== "all") {
        const hasProg = s.programs.some(
          (p) => p.code.toLowerCase() === selectedDiscipline.toLowerCase()
        );
        if (!hasProg) return false;
      }
      if (activeLetter && !s.name.trim().toUpperCase().startsWith(activeLetter)) {
        return false;
      }
      if (q) {
        const hay = `${s.name} ${s.programs.map((p) => `${p.code} S${p.semester}`).join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [subjects, query, activeLetter, selectedDiscipline, onlyPyqBank]);

  const availableLetters = useMemo(() => {
    const set = new Set<string>();
    const q = query.trim().toLowerCase();
    for (const s of subjects) {
      if (onlyPyqBank && !s.hasQuestionBank) continue;
      if (selectedDiscipline === "other" && s.programs.length > 0) continue;
      if (
        selectedDiscipline !== "all" &&
        selectedDiscipline !== "other" &&
        !s.programs.some((p) => p.code.toLowerCase() === selectedDiscipline.toLowerCase())
      ) {
        continue;
      }
      if (q && !s.name.toLowerCase().includes(q)) continue;
      const first = s.name.trim()[0]?.toUpperCase();
      if (first) set.add(first);
    }
    return set;
  }, [subjects, query, selectedDiscipline, onlyPyqBank]);

  const grouped = useMemo(() => {
    const map = new Map<string, DirectorySubjectItem[]>();
    for (const s of filtered) {
      const letter = s.name.trim()[0]?.toUpperCase() ?? "#";
      const list = map.get(letter) ?? [];
      list.push(s);
      map.set(letter, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const hasActiveFilters =
    query !== "" || activeLetter !== null || selectedDiscipline !== "all" || onlyPyqBank;

  const resetFilters = () => {
    setQuery("");
    setActiveLetter(null);
    setSelectedDiscipline("all");
    setOnlyPyqBank(false);
  };

  return (
    <div className="space-y-8">
      {/* Filter Controls */}
      <div className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-gray-800/90 dark:bg-gray-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveLetter(null);
              }}
              placeholder="Filter subjects in real-time… (e.g. 'database', 'thermodynamics', 'math')"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-gray-900"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-gray-800 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOnlyPyqBank((prev) => !prev)}
            className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-xs font-bold transition ${
              onlyPyqBank
                ? "bg-amber-500 text-white shadow-xs"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-300 dark:hover:bg-gray-700"
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            PYQ Bank Only
          </button>
        </div>

        {/* Discipline Filter Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Engineering Discipline
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Reset All Filters
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedDiscipline("all")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                selectedDiscipline === "all"
                  ? "bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-300"
              }`}
            >
              All ({subjects.length})
            </button>
            {disciplines.map((d) => {
              const isSelected = selectedDiscipline === d.code.toLowerCase();
              return (
                <button
                  key={d.code}
                  type="button"
                  onClick={() =>
                    setSelectedDiscipline(isSelected ? "all" : d.code.toLowerCase())
                  }
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs dark:bg-blue-500"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-300"
                  }`}
                >
                  <span>{d.code}</span>
                  <span
                    className={`hidden font-normal text-[11px] sm:inline ${
                      isSelected ? "text-blue-100" : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    ({d.name})
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() =>
                setSelectedDiscipline(selectedDiscipline === "other" ? "all" : "other")
              }
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                selectedDiscipline === "other"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:text-amber-700 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-300"
              }`}
            >
              Other Faculties
            </button>
          </div>
        </div>

        {/* A-Z Letter Jump Pills */}
        <div className="flex flex-wrap items-center gap-1 pt-1">
          <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Letter:
          </span>
          {ALPHABET.map((char) => {
            const isAvailable = availableLetters.has(char);
            const isSelected = activeLetter === char;
            return (
              <button
                key={char}
                type="button"
                disabled={!isAvailable}
                onClick={() => setActiveLetter(isSelected ? null : char)}
                className={`h-7 w-7 rounded-lg text-xs font-bold transition ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs dark:bg-blue-500"
                    : isAvailable
                      ? "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:bg-gray-800 dark:text-slate-300 dark:hover:bg-gray-700 dark:hover:text-white"
                      : "cursor-not-allowed text-slate-400 opacity-25 dark:text-slate-600"
                }`}
              >
                {char}
              </button>
            );
          })}
        </div>

        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
          Showing {filtered.length} of {subjects.length} subjects
        </p>
      </div>

      {/* Grouped Results */}
      {grouped.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
          <Search className="mx-auto h-6 w-6 text-slate-400" />
          <h2 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
            No matching subjects
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Try clearing one of your search, discipline, or letter filters.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-9">
          {grouped.map(([letter, list]) => (
            <section key={letter} className="space-y-3">
              <div className="flex items-center gap-3 border-b border-slate-200/80 pb-2 dark:border-gray-800">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 font-mono text-sm font-extrabold text-white shadow-xs dark:bg-blue-500">
                  {letter}
                </span>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                  {list.length} {list.length === 1 ? "subject" : "subjects"}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((subject) => (
                  <Link
                    key={subject.name}
                    href={subject.primaryPath}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-gray-800/90 dark:bg-gray-900 dark:hover:border-blue-500/50"
                  >
                    <div>
                      {subject.programs.length > 0 && (
                        <div className="mb-2 flex flex-wrap items-center gap-1">
                          {subject.programs.slice(0, 3).map((p) => (
                            <span
                              key={`${p.code}-${p.semester}`}
                              className="rounded-md bg-blue-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                            >
                              {p.code} S{p.semester}
                            </span>
                          ))}
                          {subject.programs.length > 3 && (
                            <span className="text-[10px] font-medium text-slate-400">
                              +{subject.programs.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      <span className="block text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                        {subject.name}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-gray-800/80">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                          <FileText className="h-3 w-3" />
                          {subject.papersCount} {subject.papersCount === 1 ? "paper" : "papers"}
                        </span>
                        {subject.hasQuestionBank && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                            <Flame className="h-2.5 w-2.5" />
                            PYQ Bank
                          </span>
                        )}
                      </div>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-gray-800 dark:text-slate-500 dark:group-hover:bg-blue-950/60 dark:group-hover:text-blue-400">
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
