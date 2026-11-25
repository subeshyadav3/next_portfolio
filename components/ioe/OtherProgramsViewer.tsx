"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { IoeCatalogSubject } from "@/lib/ioe/types";
import { getSubjectSlugFromName } from "@/lib/ioe/data";
import {
  Search,
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
  X,
  Flame,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface OtherProgramsViewerProps {
  subjects: IoeCatalogSubject[];
  programs?: Array<{ code: string; name: string; slug: string; fullName: string }>;
  questionBankSubjects?: string[];
}

export function OtherProgramsViewer({
  subjects,
  questionBankSubjects = [],
}: OtherProgramsViewerProps) {
  const [search, setSearch] = useState("");
  const [onlyPyqBank, setOnlyPyqBank] = useState(false);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [activePaperIdx, setActivePaperIdx] = useState<Record<string, number>>({});

  const pyqSet = useMemo(() => new Set(questionBankSubjects), [questionBankSubjects]);

  const filteredSubjects = useMemo(() => {
    let list = subjects;
    if (onlyPyqBank) {
      list = list.filter((s) => pyqSet.has(s.name));
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [subjects, search, onlyPyqBank, pyqSet]);

  const toggleExpand = (name: string) => {
    setExpandedSlug(expandedSlug === name ? null : name);
  };

  const setPaper = (subjectName: string, idx: number) => {
    setActivePaperIdx((prev) => ({ ...prev, [subjectName]: idx }));
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls */}
      <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-colors dark:border-gray-800/90 dark:bg-gray-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subjects in other disciplines (e.g., 'Thermodynamics', 'Power Electronics', 'Machines')…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-gray-900"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-gray-800 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {questionBankSubjects.length > 0 && (
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
              PYQ Bank Only ({questionBankSubjects.length})
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing {filteredSubjects.length} of {subjects.length} subjects
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Open Study Hub for full PYQ banks, or expand for quick PDF preview
          </span>
        </div>
      </div>

      {/* Subjects Listing */}
      <div className="space-y-3">
        {filteredSubjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              No subjects found matching your filter
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Try searching with another keyword or clearing filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setOnlyPyqBank(false);
              }}
              className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredSubjects.map((subject) => {
            const isExpanded = expandedSlug === subject.name;
            const currentIdx = activePaperIdx[subject.name] ?? 0;
            const currentPaper = subject.papers[Math.min(currentIdx, subject.papers.length - 1)];
            const subjectHref = `/ioe/subjects/${getSubjectSlugFromName(subject.name)}`;
            const hasPyq = pyqSet.has(subject.name);

            return (
              <div
                key={subject.name}
                className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all dark:border-gray-800/90 dark:bg-gray-900"
              >
                <div className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center sm:p-5">
                  <div
                    onClick={() => toggleExpand(subject.name)}
                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-3.5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                          {subject.name}
                        </h3>
                        {hasPyq && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                            <Flame className="h-2.5 w-2.5" />
                            PYQ Bank
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {subject.papers.length} past exam{" "}
                        {subject.papers.length === 1 ? "paper" : "papers"} available
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Link
                      href={subjectHref}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-600 dark:bg-white dark:text-slate-900 dark:hover:bg-blue-500 dark:hover:text-white"
                    >
                      Study Hub
                      <ArrowRight className="h-3 w-3" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => toggleExpand(subject.name)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200 dark:hover:bg-gray-700"
                    >
                      <span>{isExpanded ? "Hide PDF" : "Quick PDF"}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded PDF Viewer & Download Section */}
                {isExpanded && (
                  <div className="space-y-4 border-t border-slate-200 bg-slate-50/50 p-5 dark:border-gray-800 dark:bg-gray-950/50">
                    {subject.papers.length > 1 && (
                      <div className="flex flex-wrap items-center gap-1.5 pb-1">
                        <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Select Paper:
                        </span>
                        {subject.papers.map((p, pIdx) => (
                          <button
                            key={p.id || pIdx}
                            type="button"
                            onClick={() => setPaper(subject.name, pIdx)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                              pIdx === currentIdx
                                ? "bg-blue-600 text-white shadow-xs dark:bg-blue-500"
                                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-300 dark:hover:bg-gray-800"
                            }`}
                          >
                            {p.sem ? p.sem.replace(/-/g, " ").toUpperCase() : `Paper ${pIdx + 1}`}
                          </button>
                        ))}
                      </div>
                    )}

                    {currentPaper && (
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 dark:border-gray-800 dark:bg-gray-900">
                        <p className="min-w-0 truncate pr-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                          File: {currentPaper.file}
                        </p>
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://drive.google.com/file/d/${currentPaper.id}/view`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200"
                          >
                            <ExternalLink className="h-3.5 w-3.5 text-blue-500" />
                            Drive
                          </a>
                          <a
                            href={`https://drive.google.com/uc?export=download&id=${currentPaper.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </a>
                        </div>
                      </div>
                    )}

                    {currentPaper && currentPaper.id && (
                      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-inner dark:border-gray-800 sm:aspect-16/10">
                        <iframe
                          src={`https://drive.google.com/file/d/${currentPaper.id}/preview`}
                          title={`${subject.name} Past Paper`}
                          className="h-full w-full border-0"
                          loading="lazy"
                          allow="autoplay"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
