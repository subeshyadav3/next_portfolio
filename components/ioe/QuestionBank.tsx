"use client";

import { useMemo, useState, useEffect } from "react";
import type { IoeQuestion } from "@/lib/ioe/types";
import { Search, X, Flame, Copy, Check, Sparkles, Layers, ChevronDown, ArrowUp } from "lucide-react";
import { MathText } from "@/components/ioe/MathText";
import { copyToClipboard } from "@/lib/clipboard";

interface QuestionBankProps {
  chapters: string[];
  questions: IoeQuestion[];
  subject: string;
}

type FreqFilter = "all" | "once" | "twice" | "many";

const FREQ_LABELS: Record<FreqFilter, string> = {
  all: "All",
  once: "1× Once",
  twice: "2× Twice",
  many: "3×+ High Yield",
};

function matchesFreq(item: IoeQuestion, filter: FreqFilter): boolean {
  switch (filter) {
    case "once":
      return item.frequency === 1;
    case "twice":
      return item.frequency === 2;
    case "many":
      return item.frequency >= 3;
    default:
      return true;
  }
}

const mostAsked = (questions: IoeQuestion[]) =>
  questions.reduce((max, q) => Math.max(max, q.frequency), 1);

export function QuestionBank({ chapters, questions, subject }: QuestionBankProps) {
  const [chapter, setChapter] = useState<string>("all");
  const [freq, setFreq] = useState<FreqFilter>("all");
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

  const scoped = useMemo(() => {
    const q = query.trim().toLowerCase();
    return questions.filter((item) => {
      if (chapter !== "all" && item.chapter !== chapter) return false;
      if (q && !item.text.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [questions, chapter, query]);

  const visible = useMemo(
    () => scoped.filter((item) => matchesFreq(item, freq)),
    [scoped, freq]
  );

  const freqCounts = useMemo(() => {
    const counts: Record<FreqFilter, number> = { all: scoped.length, once: 0, twice: 0, many: 0 };
    for (const item of scoped) {
      if (item.frequency === 1) counts.once++;
      else if (item.frequency === 2) counts.twice++;
      else counts.many++;
    }
    return counts;
  }, [scoped]);

  const byChapter = useMemo(() => {
    const map = new Map<string, IoeQuestion[]>();
    for (const item of visible) {
      const list = map.get(item.chapter) ?? [];
      list.push(item);
      map.set(item.chapter, list);
    }
    return [...map.entries()];
  }, [visible]);

  const frequencySections = (items: IoeQuestion[]) => [
    { key: "many", label: "High Yield (3×+)", questions: items.filter((item) => item.frequency >= 3) },
    { key: "twice", label: "Repeated Twice (2×)", questions: items.filter((item) => item.frequency === 2) },
    { key: "once", label: "Asked Once (1×)", questions: items.filter((item) => item.frequency === 1) },
  ].filter((section) => section.questions.length > 0);

  const repeated = questions.filter((q) => q.frequency > 1).length;
  const highYieldCount = questions.filter((q) => q.frequency >= 3).length;

  const resetFilters = () => {
    setChapter("all");
    setFreq("all");
    setQuery("");
  };

  return (
    <div className="mt-12 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
              <Layers className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Chapter-wise Question Bank
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Categorized questions from past {subject} papers sorted by exam occurrence frequency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {highYieldCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 border border-rose-200/80 dark:border-rose-900/60 dark:bg-rose-950/70 dark:text-rose-300">
              <Flame className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
              {highYieldCount} High-Yield (3×+)
            </span>
          )}
          {repeated > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200/80 dark:border-amber-900/60 dark:bg-amber-950/70 dark:text-amber-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              {repeated} Repeated Questions
            </span>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition-colors dark:border-gray-800/90 dark:bg-gray-900">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search in questions (e.g. 'explain', 'derivation', 'algorithm')…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-blue-500 focus:outline-hidden dark:border-gray-800 dark:bg-gray-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500"
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

          {/* Chapter Select */}
          <div className="relative min-w-[220px]">
            <select
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              aria-label="Filter by chapter"
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-9 text-sm font-medium text-slate-800 transition focus:border-blue-500 focus:outline-hidden dark:border-gray-800 dark:bg-gray-900 dark:text-slate-100 dark:focus:border-blue-500"
            >
              <option value="all" className="bg-white text-slate-900 dark:bg-gray-900 dark:text-slate-100">
                All Chapters ({chapters.length})
              </option>
              {chapters.map((c) => (
                <option key={c} value={c} className="bg-white text-slate-900 dark:bg-gray-900 dark:text-slate-100">
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          </div>

          {/* Frequency Segmented Buttons */}
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by frequency">
            {(Object.keys(FREQ_LABELS) as FreqFilter[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFreq(key)}
                disabled={freqCounts[key] === 0}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  freq === key
                    ? "bg-blue-600 text-white shadow-xs shadow-blue-500/20 dark:bg-blue-500"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-gray-800 dark:text-slate-300 dark:hover:bg-gray-700 dark:hover:text-white"
                }`}
              >
                {key === "many" && <Flame className="h-3 w-3 text-rose-400" />}
                {FREQ_LABELS[key]}
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    freq === key
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-600 dark:bg-gray-900 dark:text-slate-400"
                  }`}
                >
                  {freqCounts[key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Status Line */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-gray-800/80 dark:text-slate-400">
          <div>
            Showing <span className="font-semibold text-slate-900 dark:text-white">{visible.length}</span> of{" "}
            <span className="font-semibold text-slate-900 dark:text-white">{questions.length}</span> questions
            {freq !== "all" && (
              <span> · Frequency: <strong className="text-slate-900 dark:text-white">{FREQ_LABELS[freq]}</strong></span>
            )}
            {chapter !== "all" && (
              <span> · Chapter: <strong className="text-slate-900 dark:text-white">{chapter}</strong></span>
            )}
          </div>
          {(query || chapter !== "all" || freq !== "all") && (
            <button
              type="button"
              onClick={resetFilters}
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {visible.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center transition-colors dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-gray-800 dark:text-slate-500">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">No questions matched</h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
            Try adjusting your search query, chapter filter, or frequency criteria.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs shadow-blue-500/20 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Chapter Groups */}
      <div className="space-y-8">
        {byChapter.map(([name, items]) => (
          <section key={name} className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 dark:border-gray-800">
              <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <span className="h-4 w-1 rounded-full bg-blue-600 dark:bg-blue-500" />
                {name}
              </h3>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-gray-800 dark:text-slate-400">
                {items.length} {items.length === 1 ? "question" : "questions"}
              </span>
            </div>

            <div className="space-y-5">
              {frequencySections(items).map((section) => (
                <div key={section.key} className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                    {section.label} · {section.questions.length} {section.questions.length === 1 ? "question" : "questions"}
                  </h4>
                  {section.questions.map((item, i) => {
                  const hot = item.frequency >= 3;
                  const repeatedQ = item.frequency === 2;
                  const questionId = `${item.chapter}-${section.key}-${i}`;
                  const isCopied = copiedIndex === questionId;

                  return (
                    <div
                      key={questionId}
                      className={`group relative rounded-2xl border p-4 sm:p-5 transition-all duration-150 ${
                        hot
                          ? "border-rose-200 bg-rose-50/40 shadow-xs hover:border-rose-300 dark:border-rose-900/60 dark:bg-rose-950/20 dark:hover:border-rose-800"
                          : repeatedQ
                            ? "border-amber-200/90 bg-amber-50/30 shadow-xs hover:border-amber-300 dark:border-amber-900/50 dark:bg-amber-950/15 dark:hover:border-amber-800"
                            : "border-slate-200/90 bg-white shadow-xs hover:border-slate-300 dark:border-gray-800/90 dark:bg-gray-900 dark:hover:border-gray-700"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {hot ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-xs shadow-rose-500/20">
                              <Flame className="h-3 w-3" />
                              Asked {item.frequency}× (High Yield)
                            </span>
                          ) : repeatedQ ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              <Sparkles className="h-3 w-3" />
                              Asked {item.frequency}×
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-gray-800 dark:text-slate-400">
                              Single paper (1×)
                            </span>
                          )}

                          {item.marks && (
                            <span className="rounded-md bg-blue-50 px-2 py-0.5 font-mono text-xs font-semibold text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
                              {item.marks} marks
                            </span>
                          )}

                          {item.years && item.years.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              <span>Years:</span>
                              {item.years.map((y) => (
                                <span
                                  key={y}
                                  className="rounded bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200/80 dark:border-gray-800 dark:bg-gray-950 dark:text-slate-300"
                                >
                                  {y}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopy(item.text, questionId)}
                          title="Copy question text"
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-500 opacity-80 transition hover:bg-slate-100 hover:text-slate-900 group-hover:opacity-100 dark:text-slate-400 dark:hover:bg-gray-800 dark:hover:text-white"
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <MathText
                        text={item.text}
                        className="mt-3 block text-sm leading-relaxed text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  );
                  })}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {questions.length > 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center text-xs text-slate-500 shadow-xs dark:border-gray-800 dark:bg-gray-900 dark:text-slate-400">
          💡 Highest occurrence observed: asked <strong className="text-slate-900 dark:text-white">{mostAsked(questions)} times</strong> across available exam sessions.
        </div>
      )}

      {/* Floating Back to Top Button for Mobile / Long Question Banks */}
      {showTopBtn && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
