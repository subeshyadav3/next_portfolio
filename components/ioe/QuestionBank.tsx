"use client";

import { useMemo, useState, useEffect } from "react";
import type { IoeQuestion } from "@/lib/ioe/types";
import { Search, X, Copy, Check, Calendar, BookOpen, Layers, ChevronDown, ArrowUp } from "lucide-react";
import { MathText } from "@/components/ioe/MathText";
import { copyToClipboard } from "@/lib/clipboard";

interface QuestionBankProps {
  chapters: string[];
  questions: IoeQuestion[];
  subject: string;
}

type ViewMode = "year" | "chapter";

export function QuestionBank({ chapters, questions, subject }: QuestionBankProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("year");
  const [selectedChapter, setSelectedChapter] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [showTopBtn, setShowTopBtn] = useState(false);

  // Extract all distinct exam years present in the questions
  const allYears = useMemo(() => {
    const yearsSet = new Set<string>();
    for (const q of questions) {
      if (q.year) {
        yearsSet.add(q.year);
      } else if (q.years && q.years.length > 0) {
        q.years.forEach((y) => yearsSet.add(y));
      }
    }
    return Array.from(yearsSet).sort((a, b) => b.localeCompare(a));
  }, [questions]);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopy = async (text: string, id: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedIndex(id);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  // Filter questions based on chapter, year, and search query
  const filteredQuestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return questions.filter((item) => {
      if (selectedChapter !== "all" && item.chapter !== selectedChapter) return false;
      if (selectedYear !== "all") {
        const itemYear = item.year || item.years?.[0];
        const itemYears = item.years || (item.year ? [item.year] : []);
        if (itemYear !== selectedYear && !itemYears.includes(selectedYear)) return false;
      }
      if (q && !item.text.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [questions, selectedChapter, selectedYear, query]);

  // Group by Year / Exam Session
  const groupedByYear = useMemo(() => {
    const map = new Map<string, IoeQuestion[]>();
    for (const item of filteredQuestions) {
      const yearKey = item.year || item.years?.[0] || "Exam Session";
      const list = map.get(yearKey) ?? [];
      list.push(item);
      map.set(yearKey, list);
    }
    return [...map.entries()].sort(([a], [b]) => b.localeCompare(a));
  }, [filteredQuestions]);

  // Group by Chapter
  const groupedByChapter = useMemo(() => {
    const map = new Map<string, IoeQuestion[]>();
    for (const item of filteredQuestions) {
      const chKey = item.chapter || "General";
      const list = map.get(chKey) ?? [];
      list.push(item);
      map.set(chKey, list);
    }
    return [...map.entries()];
  }, [filteredQuestions]);

  const resetFilters = () => {
    setSelectedChapter("all");
    setSelectedYear("all");
    setQuery("");
  };

  return (
    <div className="mt-12 space-y-6">
      {/* ── Section Header & View Mode Switcher ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
              <Layers className="h-4 w-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              IOE Past Examination Questions
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Past examination questions for {subject} with marks breakdown, verified formulas, and chapter mapping.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100/80 p-1 dark:border-gray-800 dark:bg-gray-800/80">
          <button
            type="button"
            onClick={() => setViewMode("year")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              viewMode === "year"
                ? "bg-white text-slate-900 shadow-xs dark:bg-gray-900 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Calendar className="h-3.5 w-3.5 text-blue-500" />
            Year-Wise Papers
          </button>
          <button
            type="button"
            onClick={() => setViewMode("chapter")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              viewMode === "chapter"
                ? "bg-white text-slate-900 shadow-xs dark:bg-gray-900 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
            Chapter-Wise Filter
          </button>
        </div>
      </div>

      {/* ── Search & Filter Toolbar ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search in ${subject} questions (e.g. 'explain', 'derive', 'algorithm')...`}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-9 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-gray-900"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Exam Year Filter */}
          <div className="relative min-w-[180px]">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              aria-label="Filter by exam year"
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-9 text-xs sm:text-sm font-semibold text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-slate-100"
            >
              <option value="all">All Exam Sessions ({allYears.length})</option>
              {allYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr} Exam
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Chapter Filter */}
          <div className="relative min-w-[220px]">
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              aria-label="Filter by chapter"
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-9 text-xs sm:text-sm font-semibold text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-slate-100"
            >
              <option value="all">All Syllabus Chapters ({chapters.length})</option>
              {chapters.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Status Line */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-gray-800 dark:text-slate-400">
          <div>
            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredQuestions.length}</span> of{" "}
            <span className="font-bold text-slate-900 dark:text-white">{questions.length}</span> questions
            {selectedYear !== "all" && (
              <span> · Session: <strong className="text-slate-900 dark:text-white">{selectedYear}</strong></span>
            )}
            {selectedChapter !== "all" && (
              <span> · Chapter: <strong className="text-slate-900 dark:text-white">{selectedChapter}</strong></span>
            )}
          </div>
          {(query || selectedChapter !== "all" || selectedYear !== "all") && (
            <button
              type="button"
              onClick={resetFilters}
              className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* ── Empty State ── */}
      {filteredQuestions.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-gray-800">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">No questions matched</h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
            Try adjusting your search query, exam year, or chapter filter.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* ── MODE 1: YEAR-WISE EXAM SESSIONS ── */}
      {viewMode === "year" && (
        <div className="space-y-10">
          {groupedByYear.map(([yearTitle, items]) => (
            <section
              key={yearTitle}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900"
            >
              {/* Exam Session Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/40">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 font-mono text-xs font-extrabold text-white shadow-xs">
                    IOE
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white sm:text-lg">
                      {yearTitle} Examination Paper
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      IOE Engineering Past Exam Session
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {items.length} Questions
                </span>
              </div>

              {/* Questions List */}
              <div className="divide-y divide-slate-100 p-4 sm:p-6 dark:divide-gray-800">
                {items.map((item, idx) => {
                  const qId = `${yearTitle}-${idx}`;
                  const isCopied = copiedIndex === qId;
                  const qNum = item.q_num || `Q.${idx + 1}`;

                  return (
                    <div key={qId} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-slate-900 px-2.5 py-0.5 font-mono text-xs font-bold text-white dark:bg-slate-100 dark:text-slate-900">
                            {qNum}
                          </span>
                          {item.marks && (
                            <span className="rounded-md bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                              [{item.marks} Marks]
                            </span>
                          )}
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-gray-800 dark:text-slate-400">
                            {item.chapter}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopy(item.text, qId)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <MathText
                        text={item.text}
                        className="mt-2.5 block text-sm leading-relaxed text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* ── MODE 2: CHAPTER-WISE VIEW ── */}
      {viewMode === "chapter" && (
        <div className="space-y-8">
          {groupedByChapter.map(([chName, items]) => (
            <section
              key={chName}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900"
            >
              {/* Chapter Header */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/40">
                <h3 className="flex items-center gap-2.5 text-base font-extrabold text-slate-900 dark:text-white">
                  <span className="h-4 w-1 rounded-full bg-blue-600" />
                  {chName}
                </h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-gray-800 dark:text-slate-300">
                  {items.length} Questions
                </span>
              </div>

              {/* Questions */}
              <div className="divide-y divide-slate-100 p-4 sm:p-6 dark:divide-gray-800">
                {items.map((item, idx) => {
                  const qId = `${chName}-${idx}`;
                  const isCopied = copiedIndex === qId;
                  const yearTag = item.year || item.years?.[0] || "Past Paper";

                  return (
                    <div key={qId} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white">
                            {yearTag}
                          </span>
                          {item.marks && (
                            <span className="rounded-md bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                              [{item.marks} Marks]
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopy(item.text, qId)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <MathText
                        text={item.text}
                        className="mt-2.5 block text-sm leading-relaxed text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Floating Back to Top Button */}
      {showTopBtn && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 active:scale-95"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
