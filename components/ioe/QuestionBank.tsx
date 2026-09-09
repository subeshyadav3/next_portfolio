"use client";

import { useMemo, useState, useEffect } from "react";
import type { IoeQuestion } from "@/lib/ioe/types";
import {
  Search,
  X,
  Copy,
  Check,
  BookOpen,
  ChevronDown,
  ArrowUp,
  Flame,
  TrendingUp,
  Sparkles,
  Calendar,
} from "lucide-react";
import { MathText } from "@/components/ioe/MathText";
import { copyToClipboard } from "@/lib/clipboard";

interface QuestionBankProps {
  chapters?: string[];
  questions: IoeQuestion[];
  subject: string;
}

type ViewMode = "frequency" | "chapter";

export function QuestionBank({ chapters = [], questions = [], subject }: QuestionBankProps) {
  const chapterList = useMemo(() => {
    if (chapters && chapters.length > 0) return chapters;
    const set = new Set<string>();
    for (const q of questions) {
      if (q.chapter) set.add(q.chapter);
    }
    return Array.from(set);
  }, [chapters, questions]);

  const [viewMode, setViewMode] = useState<ViewMode>("chapter");
  const [selectedChapter, setSelectedChapter] = useState<string>("all");
  const [minFrequency, setMinFrequency] = useState<number>(0);
  const [query, setQuery] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [showTopBtn, setShowTopBtn] = useState(false);

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

  // Filter questions based on search query, chapter, and min-frequency
  const filteredQuestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return questions
      .filter((item) => {
        if (selectedChapter !== "all" && item.chapter !== selectedChapter) return false;
        const years = item.years || item.examSessions || (item.year ? [item.year] : []);
        const freq = item.frequency || years.length || 1;
        if (minFrequency > 0 && freq < minFrequency) return false;
        const text = (item.text || item.question || "").toLowerCase();
        if (q && !text.includes(q)) return false;
        return true;
      })
      .sort((a, b) => {
        const yearsA = a.years || a.examSessions || (a.year ? [a.year] : []);
        const yearsB = b.years || b.examSessions || (b.year ? [b.year] : []);
        const freqA = a.frequency || yearsA.length || 1;
        const freqB = b.frequency || yearsB.length || 1;
        return freqB - freqA;
      });
  }, [questions, selectedChapter, minFrequency, query]);

  // Group by Chapter for Chapter View
  const groupedByChapter = useMemo(() => {
    const map = new Map<string, IoeQuestion[]>();
    for (const item of filteredQuestions) {
      const chKey = item.chapter || "General";
      const list = map.get(chKey) ?? [];
      list.push(item);
      map.set(chKey, list);
    }
    // Sort chapters according to the official syllabus chapters order if possible
    return [...map.entries()].sort(([a], [b]) => {
      const idxA = chapterList.indexOf(a);
      const idxB = chapterList.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [filteredQuestions, chapterList]);

  const resetFilters = () => {
    setSelectedChapter("all");
    setMinFrequency(0);
    setQuery("");
  };

  const renderQuestionCard = (item: IoeQuestion, index: number, idPrefix: string) => {
    const qId = `${idPrefix}-${index}`;
    const isCopied = copiedIndex === qId;
    const qText = item.text || item.question || "";
    const years = item.years || item.examSessions || (item.year ? [item.year] : []);
    const freq = item.frequency || years.length || 1;

    return (
      <article
        key={qId}
        className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-blue-400 hover:shadow-md dark:border-gray-800/90 dark:bg-gray-900/90 dark:hover:border-blue-500/50 sm:p-6"
      >
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Rank Number */}
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 font-mono text-xs font-bold text-white shadow-xs dark:bg-slate-100 dark:text-slate-900">
              #{index + 1}
            </span>

            {/* Recurrence Frequency Pill */}
            {freq >= 7 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                <Flame className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                Asked in {freq} Exam Sessions
              </span>
            ) : freq >= 5 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                Repeated {freq} Times
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                <TrendingUp className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                Repeated {freq} Times
              </span>
            )}

            {/* Marks Badge */}
            {item.marks && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-700 dark:bg-gray-800 dark:text-slate-300">
                [{item.marks} Marks]
              </span>
            )}

            {/* Chapter Pill */}
            {item.chapter && (
              <span className="rounded-md border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-gray-700/80 dark:bg-gray-800/80 dark:text-slate-400">
                {item.chapter}
              </span>
            )}
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={() => handleCopy(qText, qId)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-gray-700 dark:text-slate-400 dark:hover:bg-gray-800 dark:hover:text-white"
            title="Copy question text"
          >
            {isCopied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Question Text */}
        <div className="mt-3.5">
          <MathText
            text={qText}
            className="text-sm sm:text-base leading-relaxed text-slate-900 dark:text-slate-100 font-normal"
          />
        </div>

        {/* Exam Sessions Tag List */}
        {years.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-gray-800/80">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1">
              <Calendar className="h-3 w-3 text-slate-400" />
              Appeared in:
            </span>
            {years.map((yr) => (
              <span
                key={yr}
                className="inline-block rounded-md bg-slate-100/90 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-gray-800 dark:text-slate-300 border border-slate-200/60 dark:border-gray-700/60"
              >
                {yr}
              </span>
            ))}
          </div>
        )}
      </article>
    );
  };

  return (
    <section className="space-y-6">
      {/* ── Section Header & View Mode Switcher ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
              <Flame className="h-4 w-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Most Frequently Asked Questions
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Top recurring IOE board exam questions for <strong className="font-semibold text-slate-700 dark:text-slate-300">{subject}</strong> with verified mark schemes, formula notation, and recurrence frequency.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100/80 p-1 dark:border-gray-800 dark:bg-gray-800/80 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode("chapter")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              viewMode === "chapter"
                ? "bg-white text-slate-900 shadow-xs dark:bg-gray-900 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-blue-500" />
            By Syllabus Chapter
          </button>
          <button
            type="button"
            onClick={() => setViewMode("frequency")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              viewMode === "frequency"
                ? "bg-white text-slate-900 shadow-xs dark:bg-gray-900 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            Ranked by Frequency
          </button>
        </div>
      </div>

      {/* ── Search & Filter Toolbar ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search in ${subject} questions (e.g. 'algorithm', 'derive', 'matrix')...`}
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

          {/* Chapter Filter */}
          <div className="relative min-w-[220px]">
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              aria-label="Filter by syllabus chapter"
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-9 text-xs sm:text-sm font-semibold text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-slate-100"
            >
              <option value="all">All Syllabus Chapters ({chapterList.length})</option>
              {chapterList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Recurrence Filter */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMinFrequency(minFrequency === 7 ? 0 : 7)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                minFrequency === 7
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-gray-800 dark:text-slate-300 dark:hover:bg-gray-700"
              }`}
            >
              🔥 7+ Times
            </button>
            <button
              type="button"
              onClick={() => setMinFrequency(minFrequency === 5 ? 0 : 5)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                minFrequency === 5
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-gray-800 dark:text-slate-300 dark:hover:bg-gray-700"
              }`}
            >
              ⭐ 5+ Times
            </button>
          </div>
        </div>

        {/* Status Line */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-gray-800 dark:text-slate-400">
          <div>
            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredQuestions.length}</span> of{" "}
            <span className="font-bold text-slate-900 dark:text-white">{questions.length}</span> top repeated questions
            {selectedChapter !== "all" && (
              <span> · Chapter: <strong className="text-slate-900 dark:text-white">{selectedChapter}</strong></span>
            )}
            {minFrequency > 0 && (
              <span> · Min Frequency: <strong className="text-slate-900 dark:text-white">{minFrequency}+ times</strong></span>
            )}
          </div>
          {(query || selectedChapter !== "all" || minFrequency > 0) && (
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
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-gray-800">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">No questions matched</h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
            Try adjusting your search keyword or clearing the chapter and frequency filters.
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

      {/* ── MODE 1: RANKED BY FREQUENCY (DEFAULT) ── */}
      {viewMode === "frequency" && filteredQuestions.length > 0 && (
        <div className="space-y-4">
          {filteredQuestions.map((item, idx) => renderQuestionCard(item, idx, "freq"))}
        </div>
      )}

      {/* ── MODE 2: BY SYLLABUS CHAPTER ── */}
      {viewMode === "chapter" && filteredQuestions.length > 0 && (
        <div className="space-y-8">
          {groupedByChapter.map(([chName, items]) => (
            <section
              key={chName}
              className="space-y-3 rounded-3xl border border-slate-200/90 bg-slate-50/50 p-5 dark:border-gray-800/90 dark:bg-gray-900/40 sm:p-6"
            >
              {/* Chapter Header */}
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2.5 text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  <span className="h-4 w-1.5 rounded-full bg-blue-600" />
                  {chName}
                </h3>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {items.length} {items.length === 1 ? "Question" : "Questions"}
                </span>
              </div>

              {/* Questions within Chapter */}
              <div className="space-y-4">
                {items.map((item, idx) => renderQuestionCard(item, idx, chName))}
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
    </section>
  );
}
