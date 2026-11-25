"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  IoeAssessmentScheme,
  IoePaper,
  IoeQuestion,
  IoeSessionPaper,
  IoeSyllabus,
  IoeSyllabusUnit,
} from "@/lib/ioe/types";
import { MathText } from "@/components/ioe/MathText";
import { PdfOverlay } from "@/components/pdf/PdfOverlay";
import { copyToClipboard } from "@/lib/clipboard";
import {
  ArrowUp,
  Award,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Flame,
  Info,
  Layers,
  Maximize2,
  Search,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";

type TabId = "questions" | "year-wise" | "papers" | "syllabus" | "scheme";
type ExamTypeFilter = "All" | "Regular" | "Back";

interface SubjectStudyHubProps {
  subject: string;
  code?: string;
  programName?: string;
  semester?: string;
  papers: IoePaper[];
  chapters: string[];
  questions: IoeQuestion[];
  yearWisePapers?: IoeSessionPaper[];
  syllabus: IoeSyllabus | null;
  assessment: IoeAssessmentScheme;
}

interface SessionGroup {
  id: string;
  session: string;
  year: string;
  month: string;
  examType: "Regular" | "Back" | "Special";
  totalMarks: number;
  questions: IoeQuestion[];
}

const BS_MONTH_ORDER: Record<string, number> = {
  baisakh: 1,
  baishakh: 1,
  jestha: 2,
  ashadh: 3,
  asadh: 3,
  shrawan: 4,
  bhadra: 5,
  ashwin: 6,
  ashoj: 6,
  kartik: 7,
  mangsir: 8,
  mushir: 8,
  poush: 9,
  magh: 10,
  falgun: 11,
  chaitra: 12,
};

function parseSessionSortKey(session: string): number {
  const match = session.match(/(\d{4})\s*([A-Za-z]+)?/);
  if (!match) return 0;
  const year = parseInt(match[1], 10);
  const month = (match[2] || "").toLowerCase();
  return year * 100 + (BS_MONTH_ORDER[month] || 0);
}

function getExamType(session: string): "Regular" | "Back" | "Special" {
  const value = session.toLowerCase();
  if (value.includes("chaitra") || value.includes("baisakh") || value.includes("baishakh")) {
    return "Regular";
  }
  return "Back";
}

function getQuestionYears(question: IoeQuestion): string[] {
  return question.years || question.examSessions || (question.year ? [question.year] : []);
}

function getQuestionText(question: IoeQuestion): string {
  return question.text || question.question || "";
}

function isDiagramQuestion(question: IoeQuestion): boolean {
  if (question.isDiagram !== undefined) return question.isDiagram;
  return /diagram|figure|draw|circuit|sketch|curve|graph|flowchart/i.test(getQuestionText(question));
}

function buildSessionGroups(
  questions: IoeQuestion[],
  yearWisePapers?: IoeSessionPaper[]
): SessionGroup[] {
  if (yearWisePapers && yearWisePapers.length > 0) {
    return yearWisePapers
      .map((paper, index) => {
        let totalMarks = 0;
        for (const question of paper.questions) {
          const marks = Number(question.marks);
          if (!isNaN(marks)) totalMarks += marks;
        }
        const match = paper.session.match(/(\d{4})\s*([A-Za-z]+)?/);
        return {
          id: `${paper.session}-${paper.examType ?? "Exam"}-${index}`,
          session: paper.session,
          year: paper.year || (match ? match[1] : "Other"),
          month: paper.month || (match && match[2] ? match[2] : ""),
          examType: paper.examType || getExamType(paper.session),
          totalMarks: paper.totalMarks || totalMarks,
          questions: paper.questions,
        };
      })
      .sort((a, b) => parseSessionSortKey(b.session) - parseSessionSortKey(a.session));
  }

  const map = new Map<string, IoeQuestion[]>();
  for (const question of questions) {
    for (const session of getQuestionYears(question)) {
      const clean = session?.trim();
      if (!clean) continue;
      const list = map.get(clean) ?? [];
      if (!list.some((item) => getQuestionText(item) === getQuestionText(question))) {
        list.push(question);
      }
      map.set(clean, list);
    }
  }

  return Array.from(map.entries())
    .map(([session, items], index) => {
      let totalMarks = 0;
      for (const question of items) {
        const marks = Number(question.marks);
        if (!isNaN(marks)) totalMarks += marks;
      }
      const match = session.match(/(\d{4})\s*([A-Za-z]+)?/);
      return {
        id: `${session}-${index}`,
        session,
        year: match ? match[1] : "Other",
        month: match && match[2] ? match[2] : "",
        examType: getExamType(session),
        totalMarks,
        questions: items,
      };
    })
    .sort((a, b) => parseSessionSortKey(b.session) - parseSessionSortKey(a.session));
}

function isTheoryUnit(unit: IoeSyllabusUnit): boolean {
  const title = unit.title.trim().toLowerCase();
  if (
    title === "practical" ||
    title.startsWith("practical (") ||
    title.startsWith("practicals") ||
    title.startsWith("laboratory work") ||
    title.startsWith("laboratory (") ||
    title.startsWith("reference") ||
    title.startsWith("textbook") ||
    title.startsWith("group project")
  ) {
    return false;
  }
  return true;
}

function cleanTopics(unit: IoeSyllabusUnit) {
  return (unit.topics ?? []).filter((topic) => {
    const title = topic.title.trim().toLowerCase();
    return (
      !title.startsWith("lab ") &&
      !title.startsWith("lab 1") &&
      !title.startsWith("lab 2") &&
      !title.startsWith("laboratory ") &&
      !title.startsWith("reference") &&
      !title.startsWith("practical") &&
      !title.startsWith("group project")
    );
  });
}

function FrequencyBadge({ frequency }: { frequency: number }) {
  if (frequency >= 10) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
        <Flame className="h-3 w-3" />
        {frequency}x repeated
      </span>
    );
  }
  if (frequency >= 5) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
        <Sparkles className="h-3 w-3" />
        {frequency}x repeated
      </span>
    );
  }
  if (frequency > 1) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
        <TrendingUp className="h-3 w-3" />
        {frequency}x repeated
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-gray-800 dark:text-slate-300">
      1 session
    </span>
  );
}

interface QuestionCardProps {
  question: IoeQuestion;
  labelNumber: string | number;
  showChapter?: boolean;
  hideFrequencyWhenOnce?: boolean;
  onOpenPdf: () => void;
}

function QuestionCard({
  question,
  labelNumber,
  showChapter = false,
  hideFrequencyWhenOnce = false,
  onOpenPdf,
}: QuestionCardProps) {
  const [copied, setCopied] = useState(false);
  const text = getQuestionText(question);
  const years = getQuestionYears(question);
  const frequency = question.frequency || years.length || 1;
  const diagram = isDiagramQuestion(question);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="group rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition hover:border-blue-300 hover:shadow-sm dark:border-gray-800/90 dark:bg-gray-900 dark:hover:border-blue-500/50 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="flex h-6 min-w-7 items-center justify-center rounded-lg bg-slate-900 px-1.5 font-mono text-[11px] font-bold text-white dark:bg-slate-100 dark:text-slate-900">
            Q{labelNumber}
          </span>
          {!(hideFrequencyWhenOnce && frequency <= 1) && <FrequencyBadge frequency={frequency} />}
          {question.marks && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-700 dark:bg-gray-800 dark:text-slate-300">
              {question.marks} marks
            </span>
          )}
          {showChapter && question.chapter && (
            <span className="rounded-md border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-gray-700/80 dark:bg-gray-800/80 dark:text-slate-400">
              {question.chapter}
            </span>
          )}
          {diagram && (
            <button
              type="button"
              onClick={onOpenPdf}
              className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 transition-colors hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300"
              title="Open the original paper to view the figure"
            >
              <FileText className="h-3 w-3" />
              Figure in PDF
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200/80 px-2 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-gray-700 dark:text-slate-400 dark:hover:bg-gray-800 dark:hover:text-white"
          title="Copy question"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-3.5">
        <MathText
          text={text}
          className="text-sm text-slate-900 dark:text-slate-100 sm:text-[15px]"
        />
      </div>

      {years.length > 0 && (
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-2.5 dark:border-gray-800/80">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <Calendar className="h-3 w-3" />
            Appeared
          </span>
          {years.slice(0, 6).map((year) => (
            <span
              key={year}
              className="rounded-md bg-slate-100/90 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-gray-800 dark:text-slate-300"
            >
              {year}
            </span>
          ))}
          {years.length > 6 && (
            <span
              className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              title={years.slice(6).join(", ")}
            >
              +{years.length - 6} more
            </span>
          )}
        </div>
      )}
    </article>
  );
}

interface ChapterPanelProps {
  chapters: string[];
  questions: IoeQuestion[];
  chapterCounts: Map<string, number>;
  onOpenPdf: () => void;
}

function ChapterPanel({ chapters, questions, chapterCounts, onOpenPdf }: ChapterPanelProps) {
  const [selectedChapter, setSelectedChapter] = useState("all");
  const [query, setQuery] = useState("");
  const [minFrequency, setMinFrequency] = useState(0);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return questions
      .filter((question) => {
        const chapter = question.chapter || "General";
        if (selectedChapter !== "all" && chapter !== selectedChapter) return false;
        const years = getQuestionYears(question);
        const frequency = question.frequency || years.length || 1;
        if (minFrequency > 0 && frequency < minFrequency) return false;
        if (needle) {
          const text = getQuestionText(question).toLowerCase();
          if (!text.includes(needle) && !chapter.toLowerCase().includes(needle)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const freqA = a.frequency || getQuestionYears(a).length || 1;
        const freqB = b.frequency || getQuestionYears(b).length || 1;
        return freqB - freqA;
      });
  }, [questions, selectedChapter, minFrequency, query]);

  const activeLabel = selectedChapter === "all" ? "All chapters" : selectedChapter;
  const activeCount =
    selectedChapter === "all" ? questions.length : chapterCounts.get(selectedChapter) ?? 0;

  const resetFilters = () => {
    setSelectedChapter("all");
    setQuery("");
    setMinFrequency(0);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Desktop Chapter Sidebar */}
      <aside className="hidden lg:block lg:sticky lg:top-32 lg:self-start">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-xs dark:border-gray-800/90 dark:bg-gray-900">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Chapters
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-gray-800 dark:text-slate-400">
              {chapters.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSelectedChapter("all")}
            className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition ${
              selectedChapter === "all"
                ? "bg-blue-600 text-white shadow-xs shadow-blue-500/20 dark:bg-blue-500"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-gray-800 dark:hover:text-white"
            }`}
          >
            <span className="flex items-center gap-2">
              <Layers className="h-3.5 w-3.5" />
              All chapters
            </span>
            <span className={selectedChapter === "all" ? "text-blue-100" : "text-slate-400"}>
              {questions.length}
            </span>
          </button>

          <div className="mt-1 max-h-[54vh] space-y-0.5 overflow-y-auto pr-0.5">
            {chapters.map((chapter) => {
              const isActive = selectedChapter === chapter;
              return (
                <button
                  key={chapter}
                  type="button"
                  onClick={() => setSelectedChapter(chapter)}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-medium transition ${
                    isActive
                      ? "bg-blue-50 font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  }`}
                >
                  <span className="line-clamp-2">{chapter}</span>
                  <span
                    className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-200"
                        : "bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-slate-400"
                    }`}
                  >
                    {chapterCounts.get(chapter) ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Question list */}
      <div className="min-w-0 space-y-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-gray-800/90 dark:bg-gray-900 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-extrabold text-slate-900 dark:text-white sm:text-base">
                {activeLabel}
              </h3>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                Showing {filtered.length} of {activeCount} questions · sorted by frequency
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <div className="relative min-w-[180px] flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search questions..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-gray-900"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {[
                { value: 0, label: "All" },
                { value: 3, label: "3+ repeats" },
                { value: 5, label: "5+ repeats" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMinFrequency(option.value)}
                  className={`rounded-xl px-2.5 py-2 text-[11px] font-bold transition ${
                    minFrequency === option.value
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-gray-800 dark:text-slate-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile chapter picker */}
          <div className="relative mt-3 lg:hidden">
            <select
              value={selectedChapter}
              onChange={(event) => setSelectedChapter(event.target.value)}
              aria-label="Select chapter"
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-slate-100"
            >
              <option value="all">All chapters ({questions.length})</option>
              {chapters.map((chapter) => (
                <option key={chapter} value={chapter}>
                  {chapter} ({chapterCounts.get(chapter) ?? 0})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
            <Search className="mx-auto h-6 w-6 text-slate-400" />
            <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">No questions found</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Try another chapter, keyword, or repeat filter.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((question, index) => (
              <QuestionCard
                key={question.id || `${activeLabel}-${index}`}
                question={question}
                labelNumber={index + 1}
                showChapter={selectedChapter === "all"}
                onOpenPdf={onOpenPdf}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface YearWisePanelProps {
  sessions: SessionGroup[];
  onOpenPdf: () => void;
}

function YearWisePanel({ sessions, onOpenPdf }: YearWisePanelProps) {
  const [selectedId, setSelectedId] = useState<string>(sessions[0]?.id ?? "");
  const [examFilter, setExamFilter] = useState<ExamTypeFilter>("All");
  const [query, setQuery] = useState("");

  const filteredSessions = useMemo(() => {
    if (examFilter === "All") return sessions;
    return sessions.filter((s) => s.examType === examFilter);
  }, [sessions, examFilter]);

  const active =
    filteredSessions.find((session) => session.id === selectedId) ?? filteredSessions[0];

  const questions = useMemo(() => {
    if (!active) return [];
    const needle = query.trim().toLowerCase();
    if (!needle) return active.questions;
    return active.questions.filter((question) => {
      const text = getQuestionText(question).toLowerCase();
      const chapter = (question.chapter || "").toLowerCase();
      return text.includes(needle) || chapter.includes(needle);
    });
  }, [active, query]);

  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
        <Calendar className="mx-auto h-6 w-6 text-slate-400" />
        <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">No year-wise papers yet</h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Year-wise questions will appear here once this subject is cataloged.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Desktop Session Sidebar */}
      <aside className="hidden lg:block lg:sticky lg:top-32 lg:self-start">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-xs dark:border-gray-800/90 dark:bg-gray-900">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Exam sessions
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-gray-800 dark:text-slate-400">
              {filteredSessions.length}
            </span>
          </div>

          <div className="mb-2 flex items-center gap-1 px-1">
            {(["All", "Regular", "Back"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setExamFilter(type)}
                className={`flex-1 rounded-lg py-1 text-[10px] font-bold transition ${
                  examFilter === type
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-gray-800 dark:text-slate-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="max-h-[54vh] space-y-0.5 overflow-y-auto pr-0.5">
            {filteredSessions.map((session) => {
              const isActive = session.id === active?.id;
              return (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(session.id);
                    setQuery("");
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left transition ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-xs shadow-emerald-500/20 dark:bg-emerald-500"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-xs font-bold">
                      <Calendar className="h-3 w-3 shrink-0" />
                      {session.session}
                    </span>
                    <span
                      className={`mt-0.5 block text-[10px] font-medium ${
                        isActive ? "text-emerald-100" : "text-slate-400"
                      }`}
                    >
                      {session.examType} · {session.questions.length} Qs
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? "bg-emerald-700/40 text-white"
                        : "bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-slate-400"
                    }`}
                  >
                    {session.totalMarks || "—"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Session questions */}
      <div className="min-w-0 space-y-4">
        {active && (
          <>
            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-gray-800/90 dark:bg-gray-900 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white sm:text-base">
                      {active.session}
                    </h3>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        active.examType === "Regular"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {active.examType}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {active.questions.length} questions · {active.totalMarks || "—"} total marks
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative min-w-[150px] flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search this paper..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        aria-label="Clear search"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={onOpenPdf}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-300 dark:hover:bg-gray-800"
                  >
                    <FileText className="h-3.5 w-3.5 text-blue-500" />
                    <span className="hidden sm:inline">Open PDF</span>
                  </button>
                </div>
              </div>

              {/* Mobile Session & Exam Type Picker */}
              <div className="mt-3 flex flex-col gap-2 lg:hidden">
                <div className="flex items-center gap-1">
                  {(["All", "Regular", "Back"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setExamFilter(type)}
                      className={`flex-1 rounded-lg py-1.5 text-[11px] font-bold transition ${
                        examFilter === type
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                          : "bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-slate-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <select
                    value={active.id}
                    onChange={(event) => {
                      setSelectedId(event.target.value);
                      setQuery("");
                    }}
                    aria-label="Select exam session"
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-slate-100"
                  >
                    {filteredSessions.map((session) => (
                      <option key={session.id} value={session.id}>
                        {session.session} ({session.examType} · {session.questions.length} Qs)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
                <Search className="mx-auto h-6 w-6 text-slate-400" />
                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">No matching questions</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Try a different keyword for this session.
                </p>
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <QuestionCard
                    key={`${active.id}-${index}`}
                    question={question}
                    labelNumber={question.qNum ?? index + 1}
                    showChapter
                    hideFrequencyWhenOnce
                    onOpenPdf={onOpenPdf}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface PapersPanelProps {
  papers: IoePaper[];
  subject: string;
  activeIndex: number;
  onSelect: (index: number) => void;
}

function PapersPanel({ papers, subject, activeIndex, onSelect }: PapersPanelProps) {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const paper = papers[Math.min(activeIndex, papers.length - 1)];

  if (!paper) return null;

  return (
    <div className="grid gap-5 lg:grid-cols-[270px_minmax(0,1fr)]">
      {/* Desktop Paper Sidebar */}
      <aside className="hidden lg:block lg:sticky lg:top-32 lg:self-start">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-xs dark:border-gray-800/90 dark:bg-gray-900">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Available papers
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-gray-800 dark:text-slate-400">
              {papers.length}
            </span>
          </div>

          <div className="max-h-[58vh] space-y-0.5 overflow-y-auto pr-0.5">
            {papers.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.id || index}
                  type="button"
                  onClick={() => onSelect(index)}
                  className={`flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs shadow-blue-500/20 dark:bg-blue-500"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  }`}
                >
                  <FileText className={`mt-0.5 h-4 w-4 shrink-0 ${isActive ? "text-blue-200" : "text-slate-400"}`} />
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold">
                      {item.sem ? item.sem.replace(/-/g, " ") : `Paper ${index + 1}`}
                    </span>
                    <span
                      className={`mt-0.5 block truncate text-[10px] ${
                        isActive ? "text-blue-100" : "text-slate-400"
                      }`}
                      title={item.file}
                    >
                      {item.file}
                    </span>
                    {item.isCrossSemester && (
                      <span
                        className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[9px] font-bold ${
                          isActive
                            ? "bg-amber-300/30 text-amber-100"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                        }`}
                      >
                        Cross-program
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Paper viewer */}
      <div className="min-w-0 space-y-3">
        {/* Mobile Paper Switcher Strip */}
        {papers.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none lg:hidden">
            {papers.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.id || index}
                  type="button"
                  onClick={() => onSelect(index)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs dark:bg-blue-500"
                      : "border border-slate-200 bg-white text-slate-700 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-300"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>{item.sem ? item.sem.replace(/-/g, " ") : `Paper ${index + 1}`}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:border-gray-800/90 dark:bg-gray-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 dark:border-gray-800 sm:p-5">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                {paper.file}
              </h3>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                {subject} · {paper.sem ? paper.sem.replace(/-/g, " ") : "Past paper"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {paper.driveViewUrl && (
                <a
                  href={paper.driveViewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-300 dark:hover:bg-gray-800"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-blue-500" />
                  Drive
                </a>
              )}
              <button
                type="button"
                onClick={() => setOverlayOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-900/50"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                Full view
              </button>
              <a
                href={paper.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-[11px] font-semibold text-white shadow-xs shadow-blue-500/20 transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </a>
            </div>
          </div>

          {paper.isCrossSemester && (
            <div className="flex items-center gap-2 border-b border-amber-200/70 bg-amber-50/80 px-4 py-2.5 text-[11px] text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
              <Info className="h-3.5 w-3.5 shrink-0" />
              Archived from another IOE program track that shares this course syllabus.
            </div>
          )}

          <div className="relative bg-slate-100 dark:bg-gray-950">
            <iframe
              key={paper.id}
              src={paper.previewUrl}
              title={paper.file}
              className="h-[60vh] min-h-[380px] w-full border-0 sm:h-[72vh] sm:min-h-[520px]"
              loading="lazy"
              allow="fullscreen"
            />
            <button
              type="button"
              onClick={() => setOverlayOpen(true)}
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900/70 text-white shadow-md backdrop-blur transition hover:bg-slate-900"
              title="Open full view"
              aria-label="Open full view"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-[11px] leading-relaxed text-slate-500 dark:border-gray-800/80 dark:bg-gray-900/50 dark:text-slate-400">
          <p>
            <strong className="font-semibold text-slate-700 dark:text-slate-300">Document information:</strong>{" "}
            This paper is an IOE/TU academic document cataloged from a public{" "}
            <a
              href={paper.archiveSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Google Drive archive
            </a>
            . This independent website is not affiliated with TU or IOE.
          </p>
          <p className="mt-1">
            Rights holders can request removal by emailing{" "}
            <a
              href={`mailto:subeshgaming@gmail.com?subject=${encodeURIComponent(`IOE document removal request: ${paper.file}`)}`}
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              subeshgaming@gmail.com
            </a>
            .
          </p>
        </div>
      </div>

      {overlayOpen && (
        <PdfOverlay
          papers={papers}
          activePaperIndex={activeIndex}
          onPaperSelect={onSelect}
          src={paper.previewUrl}
          title={paper.file}
          downloadUrl={paper.downloadUrl}
          subjectTitle={subject}
          onClose={() => setOverlayOpen(false)}
        />
      )}
    </div>
  );
}

interface SyllabusPanelProps {
  subject: string;
  syllabus: IoeSyllabus | null;
}

function SyllabusPanel({ subject, syllabus }: SyllabusPanelProps) {
  const units = useMemo(() => (syllabus?.units ?? []).filter(isTheoryUnit), [syllabus]);
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number | "all">(0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white sm:text-base">
            <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Curriculum &amp; Course Topics
          </h3>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            {units.length > 0
              ? `${units.length} theory units for ${subject}`
              : `Syllabus details for ${subject}`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {syllabus?.syllabus && (
            <a
              href={syllabus.syllabus}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300"
            >
              <FileText className="h-3.5 w-3.5" />
              Full syllabus PDF
            </a>
          )}
          {syllabus?.micro && (
            <a
              href={syllabus.micro}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-300 dark:hover:bg-gray-800"
            >
              <FileText className="h-3.5 w-3.5" />
              Micro syllabus
            </a>
          )}
        </div>
      </div>

      {units.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
          <BookOpen className="mx-auto h-6 w-6 text-slate-400" />
          <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Syllabus PDF only</h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
            The detailed unit breakdown is not available for {subject}. Use the official syllabus PDF above.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* Desktop Unit Sidebar */}
          <aside className="hidden lg:block lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-xs dark:border-gray-800/90 dark:bg-gray-900">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Units
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-gray-800 dark:text-slate-400">
                  {units.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUnitIndex("all")}
                className={`mb-1 flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition ${
                  selectedUnitIndex === "all"
                    ? "bg-violet-600 text-white shadow-xs shadow-violet-500/20 dark:bg-violet-500"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-gray-800 dark:hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5" />
                  All units
                </span>
                <span className={selectedUnitIndex === "all" ? "text-violet-100" : "text-slate-400"}>
                  {units.length}
                </span>
              </button>

              <div className="max-h-[54vh] space-y-0.5 overflow-y-auto pr-0.5">
                {units.map((unit, index) => {
                  const isActive = selectedUnitIndex === index;
                  return (
                    <button
                      key={unit.num}
                      type="button"
                      onClick={() => setSelectedUnitIndex(index)}
                      className={`flex w-full items-start gap-2 rounded-xl px-3 py-2.5 text-left transition ${
                        isActive
                          ? "bg-violet-50 font-bold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-gray-800 dark:hover:text-white"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md font-mono text-[10px] font-bold ${
                          isActive
                            ? "bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-200"
                            : "bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-slate-400"
                        }`}
                      >
                        {unit.num}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold leading-snug">{unit.title}</span>
                        {unit.hours && (
                          <span
                            className={`mt-0.5 block text-[10px] ${
                              isActive ? "text-violet-500 dark:text-violet-300" : "text-slate-400"
                            }`}
                          >
                            {unit.hours}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Unit content */}
          <div className="min-w-0 space-y-3">
            {/* Mobile Unit Picker */}
            <div className="relative lg:hidden">
              <select
                value={selectedUnitIndex === "all" ? "all" : String(selectedUnitIndex)}
                onChange={(event) => {
                  const val = event.target.value;
                  setSelectedUnitIndex(val === "all" ? "all" : Number(val));
                }}
                aria-label="Select syllabus unit"
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-9 text-xs font-semibold text-slate-800 shadow-xs focus:border-violet-500 focus:outline-hidden dark:border-gray-800 dark:bg-gray-900 dark:text-slate-100"
              >
                <option value="all">All units ({units.length})</option>
                {units.map((unit, index) => (
                  <option key={unit.num} value={index}>
                    {unit.num}. {unit.title} {unit.hours ? `(${unit.hours})` : ""}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            {units.map((unit, index) => {
              const isVisible = selectedUnitIndex === "all" || index === selectedUnitIndex;
              if (!isVisible) return null;
              const topics = cleanTopics(unit);
              return (
                <div
                  key={unit.num}
                  className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-gray-800/90 dark:bg-gray-900 sm:p-6"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-3 dark:border-gray-800">
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white sm:text-base">
                      {unit.num}. {unit.title}
                    </h4>
                    {unit.hours && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        <Clock className="h-3 w-3" />
                        {unit.hours}
                      </span>
                    )}
                  </div>

                  {topics.length > 0 ? (
                    <ul className="mt-3 space-y-1.5">
                      {topics.map((topic, topicIndex) => {
                        const code = topic.code || topic.num;
                        const isSubSub = code ? code.split(".").length > 2 : false;
                        return (
                          <li
                            key={`${code ?? topicIndex}-${topicIndex}`}
                            className={`text-xs leading-relaxed ${
                              isSubSub
                                ? "ml-3 border-l-2 border-slate-200 pl-2.5 text-[11px] text-slate-500 dark:border-gray-700 dark:text-slate-400"
                                : "text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {code && (
                              <span className="mr-1.5 font-mono text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                                {code}
                              </span>
                            )}
                            {topic.title}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                      No detailed topics listed for this unit.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface SchemePanelProps {
  subject: string;
  assessment: IoeAssessmentScheme;
}

function SchemePanel({ subject, assessment }: SchemePanelProps) {
  const title = subject.toLowerCase();
  const isProject = title.includes("project") || title.includes("thesis");
  const isDrawing = title.includes("drawing");
  const isMathOrNumerical =
    title.includes("math") ||
    title.includes("numerical") ||
    title.includes("mechanics") ||
    title.includes("calculus") ||
    title.includes("statistics");
  const isSoftwareOrCS =
    title.includes("programming") ||
    title.includes("software") ||
    title.includes("algorithm") ||
    title.includes("data structure") ||
    title.includes("database");
  const isElectricalOrElectronics =
    title.includes("electrical") ||
    title.includes("electronic") ||
    title.includes("circuit") ||
    title.includes("signal") ||
    title.includes("telecommunication");
  const isCivil =
    title.includes("survey") ||
    title.includes("hydraulics") ||
    title.includes("structural") ||
    title.includes("concrete") ||
    title.includes("transportation");

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Theory exam", value: assessment.theory, note: `Pass: ${assessment.passTheory}`, color: "text-blue-600 dark:text-blue-400" },
          { label: "Internal assessment", value: assessment.internal, note: `Pass: ${assessment.passInternal}`, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Total marks", value: assessment.theory + assessment.internal, note: "Theory + internal", color: "text-violet-600 dark:text-violet-400" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-gray-800/90 dark:bg-gray-900"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {item.label}
            </p>
            <p className={`mt-1 text-2xl font-extrabold ${item.color}`}>{item.value}</p>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{item.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-gray-800/90 dark:bg-gray-900">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Evaluation structure
          </h3>
          <ul className="mt-3 list-inside list-disc space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            {isProject ? (
              <>
                <li><strong className="text-slate-800 dark:text-slate-200">Internal project assessment:</strong> Progress defense, supervisor review, and milestone logs.</li>
                <li><strong className="text-slate-800 dark:text-slate-200">Final evaluation &amp; viva:</strong> External defense, technical report submission, and viva-voce.</li>
              </>
            ) : isDrawing ? (
              <>
                <li><strong className="text-slate-800 dark:text-slate-200">Final board drawing exam:</strong> {assessment.theory} marks (pass: {assessment.passTheory})</li>
                <li><strong className="text-slate-800 dark:text-slate-200">Internal sheet assessment:</strong> {assessment.internal} marks (continuous drafting sheets + assignments)</li>
                <li><strong className="text-slate-800 dark:text-slate-200">Viva / practical:</strong> Practical drawing exam and viva assessment.</li>
              </>
            ) : (
              <>
                <li><strong className="text-slate-800 dark:text-slate-200">Final board theory exam:</strong> {assessment.theory} marks (pass: {assessment.passTheory})</li>
                <li><strong className="text-slate-800 dark:text-slate-200">Internal assessment:</strong> {assessment.internal} marks (pass: {assessment.passInternal})</li>
                <li><strong className="text-slate-800 dark:text-slate-200">Practical / lab exam:</strong> 25 or 50 marks where applicable.</li>
              </>
            )}
          </ul>
          <p className="mt-3 text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
            * {assessment.source === "syllabus"
              ? "Marks were extracted from the available curriculum syllabus."
              : "This is the general IOE 60/40 scheme; verify course-specific details in the syllabus."}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-gray-800/90 dark:bg-gray-900">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Preparation guidelines
          </h3>
          <ul className="mt-3 list-inside list-disc space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>
              Review past papers to identify recurring patterns, core problem types, and chapter weightage.
            </li>
            <li>
              {isMathOrNumerical
                ? "Practice numerical problems step-by-step with clean derivations, units, and assumptions."
                : isSoftwareOrCS
                ? "Practice clean algorithms, dry runs with sample inputs, and complexity trade-offs."
                : isDrawing
                ? "Practice standard projections, isometric views, line conventions, and neat dimensioning."
                : isElectricalOrElectronics
                ? "Practice labeled circuit schematics, transfer functions, and systematic steps."
                : isCivil
                ? "Practice design calculations, code provisions, and illustrative cross-section sketches."
                : "Cross-reference key answers with the official syllabus, textbooks, and lecture notes."}
            </li>
            <li>Structure answers with labeled diagrams, concise bullet points, and highlighted final answers.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function SubjectStudyHub({
  subject,
  code,
  programName,
  semester,
  papers,
  chapters,
  questions,
  yearWisePapers,
  syllabus,
  assessment,
}: SubjectStudyHubProps) {
  const hasQuestions = questions.length > 0;
  const sessions = useMemo(
    () => buildSessionGroups(questions, yearWisePapers),
    [questions, yearWisePapers]
  );
  const hasSessions = sessions.length > 0;

  const [tab, setTab] = useState<TabId>(hasQuestions ? "questions" : "papers");
  const [paperIndex, setPaperIndex] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const chapterCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const question of questions) {
      const chapter = question.chapter || "General";
      map.set(chapter, (map.get(chapter) ?? 0) + 1);
    }
    return map;
  }, [questions]);

  const chapterList = useMemo(() => {
    const base = chapters.length > 0 ? chapters : Array.from(chapterCounts.keys());
    const extra = Array.from(chapterCounts.keys()).filter((chapter) => !base.includes(chapter));
    return [...base, ...extra];
  }, [chapters, chapterCounts]);

  const theoryUnitCount = useMemo(
    () => (syllabus?.units ?? []).filter(isTheoryUnit).length,
    [syllabus]
  );

  const tabs: Array<{
    id: TabId;
    label: string;
    icon: typeof Flame;
    count?: number;
  }> = [
    ...(hasQuestions
      ? [{ id: "questions" as const, label: "Chapter Questions", icon: Flame, count: questions.length }]
      : []),
    ...(hasSessions
      ? [{ id: "year-wise" as const, label: "Year-wise Papers", icon: Calendar, count: sessions.length }]
      : []),
    { id: "papers", label: "PDF Papers", icon: FileText, count: papers.length },
    { id: "syllabus", label: "Syllabus", icon: BookOpen, count: theoryUnitCount || undefined },
    { id: "scheme", label: "Exam Scheme", icon: Award },
  ];

  useEffect(() => {
    const syncFromHash = (shouldScroll = false) => {
      const hash = window.location.hash.replace("#", "") as TabId;
      if (
        (hash === "questions" && hasQuestions) ||
        (hash === "year-wise" && hasSessions) ||
        hash === "papers" ||
        hash === "syllabus" ||
        hash === "scheme"
      ) {
        setTab(hash);
        if (shouldScroll) {
          const hub = document.getElementById("study-hub");
          if (hub) {
            const top = hub.getBoundingClientRect().top + window.scrollY - 88;
            window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
          }
        }
      }
    };
    syncFromHash(false);
    const onHashChange = () => syncFromHash(true);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [hasQuestions, hasSessions]);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 450);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const selectTab = (id: TabId) => {
    setTab(id);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${id}`);
      const hub = document.getElementById("study-hub");
      if (hub) {
        const top = hub.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
    }
  };

  const openPdfTab = () => selectTab("papers");

  return (
    <section id="study-hub" className="space-y-5">
      {/* ── Sticky tab menu ── */}
      <div className="sticky top-[61px] z-30 -mx-2 sm:mx-0">
        <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 shadow-sm backdrop-blur-md dark:border-gray-800/90 dark:bg-gray-900/95">
          <div
            role="tablist"
            aria-label={`${subject} study sections`}
            className="flex items-center gap-1 overflow-x-auto scrollbar-none"
          >
            {tabs.map((item) => {
              const Icon = item.icon;
              const isActive = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => selectTab(item.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 ${
                      isActive ? "text-blue-400 dark:text-blue-600" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                  {typeof item.count === "number" && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        isActive
                          ? "bg-white/15 text-white dark:bg-slate-900/10 dark:text-slate-700"
                          : "bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-slate-400"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Panels ── */}
      {hasQuestions && (
        <div className={tab === "questions" ? "" : "hidden"}>
          <ChapterPanel
            chapters={chapterList}
            questions={questions}
            chapterCounts={chapterCounts}
            onOpenPdf={openPdfTab}
          />
        </div>
      )}

      {hasSessions && (
        <div className={tab === "year-wise" ? "" : "hidden"}>
          <YearWisePanel sessions={sessions} onOpenPdf={openPdfTab} />
        </div>
      )}

      {tab === "papers" && (
        <PapersPanel
          papers={papers}
          subject={subject}
          activeIndex={paperIndex}
          onSelect={setPaperIndex}
        />
      )}

      <div className={tab === "syllabus" ? "" : "hidden"}>
        <SyllabusPanel subject={subject} syllabus={syllabus} />
      </div>

      <div className={tab === "scheme" ? "" : "hidden"}>
        <SchemePanel subject={subject} assessment={assessment} />
      </div>

      {(code || programName || semester) && (
        <p className="text-center text-[10px] text-slate-400 dark:text-slate-500">
          {[code, programName, semester ? `Semester ${semester}` : null]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}

      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:bg-slate-900 hover:text-white dark:border-gray-700 dark:bg-gray-900/95 dark:text-slate-200 dark:hover:bg-white dark:hover:text-slate-900"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </section>
  );
}
