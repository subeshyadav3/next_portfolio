"use client";

import { useMemo, useState } from "react";
import type { IoeQuestion } from "@/lib/ioe/types";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Search,
  X,
  Sparkles,
  ExternalLink,
  Layers,
  BookOpen,
} from "lucide-react";
import { MathText } from "@/components/ioe/MathText";
import { copyToClipboard } from "@/lib/clipboard";

interface YearWiseQuestionsProps {
  subject: string;
  questions: IoeQuestion[];
}

interface SessionQuestionItem {
  question: IoeQuestion;
  isDiagram: boolean;
}

interface SessionGroup {
  session: string; // e.g. "2082 Kartik", "2081 Chaitra"
  year: string;    // "2082"
  month: string;   // "Kartik"
  examType: "Regular" | "Back" | "Special";
  items: SessionQuestionItem[];
  totalMarks: number;
}

const BS_MONTH_ORDER: Record<string, number> = {
  baisakh: 1, baishakh: 1,
  jestha: 2,
  ashadh: 3, asadh: 3,
  shrawan: 4,
  bhadra: 5,
  ashwin: 6, ashoj: 6,
  kartik: 7,
  mangsir: 8, mushir: 8,
  poush: 9,
  magh: 10,
  falgun: 11,
  chaitra: 12,
};

function parseSessionSortKey(sess: string): number {
  const m = sess.match(/(\d{4})\s*([A-Za-z]+)?/);
  if (!m) return 0;
  const yr = parseInt(m[1], 10);
  const monthStr = (m[2] || "").toLowerCase();
  const monthNum = BS_MONTH_ORDER[monthStr] || 0;
  return yr * 100 + monthNum;
}

function getExamType(session: string): "Regular" | "Back" | "Special" {
  const s = session.toLowerCase();
  if (s.includes("chaitra") || s.includes("baisakh") || s.includes("baishakh")) {
    return "Regular";
  }
  return "Back";
}

export function YearWiseQuestions({ subject, questions = [] }: YearWiseQuestionsProps) {
  const [query, setQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [diagramOnly, setDiagramOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Group questions by distinct Exam Session (e.g. 2082 Kartik, 2082 Chaitra, 2081 Ashwin, etc.)
  const allSessionGroups = useMemo(() => {
    const sessionMap = new Map<string, SessionQuestionItem[]>();

    for (const q of questions) {
      const years = q.years || q.examSessions || (q.year ? [q.year] : []);
      const text = q.text || q.question || "";
      const isDiagram = /diagram|figure|draw|circuit|sketch|curve|graph|flowchart/i.test(text);

      for (const sess of years) {
        if (!sess || sess.trim().length === 0) continue;
        const cleanSess = sess.trim();

        if (!sessionMap.has(cleanSess)) {
          sessionMap.set(cleanSess, []);
        }
        sessionMap.get(cleanSess)!.push({
          question: q,
          isDiagram,
        });
      }
    }

    const groups: SessionGroup[] = Array.from(sessionMap.entries()).map(([sess, items]) => {
      const m = sess.match(/(\d{4})\s*([A-Za-z]+)?/);
      const year = m ? m[1] : "Other";
      const month = m && m[2] ? m[2] : "";
      let totalMarks = 0;
      for (const it of items) {
        const num = Number(it.question.marks);
        if (!isNaN(num)) totalMarks += num;
      }

      return {
        session: sess,
        year,
        month,
        examType: getExamType(sess),
        items,
        totalMarks,
      };
    });

    // Sort descending chronologically (e.g. 2082 Chaitra, 2082 Kartik, 2081 Chaitra...)
    return groups.sort((a, b) => parseSessionSortKey(b.session) - parseSessionSortKey(a.session));
  }, [questions]);

  // Open the first/latest exam session by default
  const [openSessions, setOpenSessions] = useState<Set<string>>(() => {
    const first = allSessionGroups[0]?.session;
    return new Set(first ? [first] : []);
  });

  const toggleSession = (sess: string) => {
    setOpenSessions((prev) => {
      const next = new Set(prev);
      if (next.has(sess)) {
        next.delete(sess);
      } else {
        next.add(sess);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenSessions(new Set(allSessionGroups.map((g) => g.session)));
  };

  const collapseAll = () => {
    setOpenSessions(new Set());
  };

  // Filter groups
  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();

    return allSessionGroups
      .map((grp) => {
        if (selectedYear !== "all" && grp.year !== selectedYear) {
          return null;
        }

        const filteredItems = grp.items.filter(({ question, isDiagram }) => {
          if (diagramOnly && !isDiagram) return false;
          if (q) {
            const text = (question.text || question.question || "").toLowerCase();
            const ch = (question.chapter || "").toLowerCase();
            if (!text.includes(q) && !ch.includes(q)) return false;
          }
          return true;
        });

        if (filteredItems.length === 0) return null;

        return {
          ...grp,
          items: filteredItems,
        };
      })
      .filter((g): g is SessionGroup => g !== null);
  }, [allSessionGroups, query, selectedYear, diagramOnly]);

  const handleCopy = async (text: string, id: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const scrollToPdf = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("pdf-viewer");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const distinctYears = useMemo(() => {
    const set = new Set<string>();
    for (const g of allSessionGroups) {
      if (g.year && g.year !== "Other") set.add(g.year);
    }
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [allSessionGroups]);

  const totalFilteredQuestions = filteredGroups.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <section id="year-wise" className="space-y-6">
      {/* ── Section Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <Calendar className="h-4 w-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Year-wise &amp; Session-wise Exam Papers
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Complete questions from each exam session (Regular &amp; Back exams from 2082 to 2069) for <strong className="font-semibold text-slate-700 dark:text-slate-300">{subject}</strong>. Click any session paper to expand.
          </p>
        </div>

        {/* Expand / Collapse Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={expandAll}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-300 dark:hover:bg-gray-800 transition shadow-xs"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-300 dark:hover:bg-gray-800 transition shadow-xs"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* ── Search & Filters Toolbar ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search in all ${subject} exam session papers...`}
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

          {/* Year Filter */}
          <div className="relative min-w-[180px]">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              aria-label="Filter by exam year"
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-9 text-xs sm:text-sm font-semibold text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-slate-100 dark:focus:bg-gray-800 dark:focus:text-white"
            >
              <option value="all">All Exam Years ({distinctYears.length})</option>
              {distinctYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr} BS Exams
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Diagram Only Filter */}
          <button
            type="button"
            onClick={() => setDiagramOnly(!diagramOnly)}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              diagramOnly
                ? "bg-violet-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-gray-800 dark:text-slate-300 dark:hover:bg-gray-700"
            }`}
          >
            <span>📐 Diagram Questions</span>
          </button>
        </div>

        {/* Status Line */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-gray-800 dark:text-slate-400">
          <div>
            Showing <span className="font-bold text-slate-900 dark:text-white">{totalFilteredQuestions}</span> questions across{" "}
            <span className="font-bold text-slate-900 dark:text-white">{filteredGroups.length}</span> exam session papers
            {selectedYear !== "all" && (
              <span> · Year: <strong className="text-slate-900 dark:text-white">{selectedYear} BS</strong></span>
            )}
            {diagramOnly && (
              <span> · <strong className="text-violet-600 dark:text-violet-400">Diagram Questions Only</strong></span>
            )}
          </div>
          {(query || selectedYear !== "all" || diagramOnly) && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedYear("all");
                setDiagramOnly(false);
              }}
              className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* ── Session Papers Accordion List ── */}
      {filteredGroups.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
          <Calendar className="mx-auto h-8 w-8 text-slate-400" />
          <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">No exam session questions found</h3>
          <p className="mt-1 text-xs text-slate-500">Try adjusting your keyword or year filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGroups.map((group) => {
            const isOpen = openSessions.has(group.session);
            const cardId = `sess-${group.session.replace(/\s+/g, "-")}`;
            const diagramCount = group.items.filter((x) => x.isDiagram).length;

            return (
              <div
                key={group.session}
                className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition dark:border-gray-800/90 dark:bg-gray-900"
              >
                {/* Session Paper Header / Toggle Button */}
                <button
                  type="button"
                  onClick={() => toggleSession(group.session)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-3 p-4 sm:p-5 text-left transition hover:bg-slate-50/80 dark:hover:bg-gray-800/50"
                >
                  <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                    <span className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1 font-mono text-xs font-bold text-white shadow-xs dark:bg-emerald-500">
                      <Calendar className="h-3.5 w-3.5" />
                      {group.session}
                    </span>

                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                      group.examType === "Regular"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}>
                      {group.examType} Exam
                    </span>

                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-gray-800 dark:text-slate-300">
                      {group.items.length} {group.items.length === 1 ? "Question" : "Questions"}
                    </span>

                    {diagramCount > 0 && (
                      <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-violet-50 px-2 py-0.5 text-[11px] font-semibold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                        📐 {diagramCount} Diagram {diagramCount === 1 ? "Question" : "Questions"}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden xs:inline">
                      {isOpen ? "Collapse Paper" : "View Exam Paper"}
                    </span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 transition-transform duration-200">
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Questions List within this Exam Session */}
                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-5 dark:border-gray-800 dark:bg-gray-900/40 space-y-4">
                    {/* Header info bar */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-gray-800 text-xs text-slate-500">
                      <span>Institute of Engineering • {group.session} Board Examination</span>
                      <button
                        type="button"
                        onClick={scrollToPdf}
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400 font-semibold"
                      >
                        <span>View Original Scanned PDF</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>

                    {group.items.map((item, idx) => {
                      const q = item.question;
                      const qId = `${cardId}-${idx}`;
                      const isCopied = copiedId === qId;
                      const qText = q.text || q.question || "";
                      const otherSessions = (q.years || q.examSessions || []).filter(
                        (s) => s !== group.session
                      );

                      return (
                        <article
                          key={qId}
                          className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-gray-800/90 dark:bg-gray-900 transition hover:border-blue-400 dark:hover:border-blue-500/50"
                        >
                          {/* Top Badges */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-900 font-mono text-[11px] font-bold text-white dark:bg-slate-100 dark:text-slate-900">
                                Q{idx + 1}
                              </span>

                              {q.marks && (
                                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-700 dark:bg-gray-800 dark:text-slate-300">
                                  [{q.marks} Marks]
                                </span>
                              )}

                              {q.chapter && (
                                <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-400">
                                  {q.chapter}
                                </span>
                              )}

                              {/* Diagram badge */}
                              {item.isDiagram && (
                                <span
                                  className="inline-flex items-center gap-1 rounded-md bg-violet-50 px-2 py-0.5 text-[11px] font-bold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
                                  title="This question requires drawing a diagram or refers to an exam figure"
                                >
                                  <span>📐 Diagram in Paper</span>
                                </span>
                              )}
                            </div>

                            {/* Actions: Copy & View in PDF */}
                            <div className="flex items-center gap-1.5">
                              {item.isDiagram && (
                                <button
                                  type="button"
                                  onClick={scrollToPdf}
                                  title="Scroll up to view the figure in the PDF paper"
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400 mr-1"
                                >
                                  <span>Figure in PDF</span>
                                  <ExternalLink className="h-3 w-3" />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleCopy(qText, qId)}
                                className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-gray-700 dark:text-slate-400 dark:hover:bg-gray-800 dark:hover:text-white transition"
                                title="Copy question text"
                              >
                                {isCopied ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3 text-slate-400" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Question Text with Math rendering */}
                          <div className="mt-3">
                            <MathText
                              text={qText}
                              className="text-sm leading-relaxed text-slate-900 dark:text-slate-100 font-normal"
                            />
                          </div>

                          {/* Repetition indicator across other exam sessions */}
                          {otherSessions.length > 0 && (
                            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-gray-800/60 flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
                              <Sparkles className="h-3 w-3 text-amber-500 mr-0.5" />
                              <span className="font-semibold">Also appeared in:</span>
                              {otherSessions.map((s) => (
                                <span
                                  key={s}
                                  className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-medium text-slate-600 dark:bg-gray-800 dark:text-slate-400"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
