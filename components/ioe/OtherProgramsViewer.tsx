"use client";

import { useState, useMemo } from "react";
import type { IoeCatalogSubject } from "@/lib/ioe/types";
import { Search, FileText, Download, ChevronDown, ChevronUp, X } from "lucide-react";

interface OtherProgramsViewerProps {
  subjects: IoeCatalogSubject[];
  programs?: Array<{ code: string; name: string; slug: string; fullName: string }>;
}

export function OtherProgramsViewer({ subjects }: OtherProgramsViewerProps) {
  const [search, setSearch] = useState("");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [activePaperIdx, setActivePaperIdx] = useState<Record<string, number>>({});

  const filteredSubjects = useMemo(() => {
    let list = subjects;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [subjects, search]);

  const toggleExpand = (name: string) => {
    setExpandedSlug(expandedSlug === name ? null : name);
  };

  const setPaper = (subjectName: string, idx: number) => {
    setActivePaperIdx((prev) => ({ ...prev, [subjectName]: idx }));
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls */}
      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition-colors dark:border-gray-800 dark:bg-gray-900">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subjects in other disciplines (e.g., 'Thermodynamics', 'Power Electronics', 'Fluid', 'Machines')…"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-10 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-gray-800 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing {filteredSubjects.length} of {subjects.length} subjects
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Click any subject to open the embedded PDF viewer & download links
          </span>
        </div>
      </div>

      {/* Subjects Listing */}
      <div className="space-y-4">
        {filteredSubjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              No subjects found matching &ldquo;{search}&rdquo;
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Try searching with another keyword or browse the full list.
            </p>
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
            >
              Clear Search
            </button>
          </div>
        ) : (
          filteredSubjects.map((subject) => {
            const isExpanded = expandedSlug === subject.name;
            const currentIdx = activePaperIdx[subject.name] ?? 0;
            const currentPaper = subject.papers[Math.min(currentIdx, subject.papers.length - 1)];

            return (
              <div
                key={subject.name}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Subject Header / Click to Expand */}
                <div
                  onClick={() => toggleExpand(subject.name)}
                  className="flex cursor-pointer items-center justify-between p-5 hover:bg-slate-50/80 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                        {subject.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {subject.papers.length} past exam {subject.papers.length === 1 ? "paper" : "papers"} available
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="hidden sm:inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-gray-800 dark:text-slate-300">
                      {isExpanded ? "Hide PDF" : "View Paper"}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-slate-400">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </span>
                  </div>
                </div>

                {/* Expanded PDF Viewer & Download Section */}
                {isExpanded && (
                  <div className="border-t border-slate-200 bg-slate-50/50 p-5 dark:border-gray-800 dark:bg-gray-950/50 space-y-4">
                    {/* Paper / Semester Tabs */}
                    {subject.papers.length > 1 && (
                      <div className="flex flex-wrap items-center gap-1.5 pb-2">
                        <span className="mr-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Select Paper:
                        </span>
                        {subject.papers.map((p, pIdx) => (
                          <button
                            key={p.id || pIdx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPaper(subject.name, pIdx);
                            }}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                              pIdx === currentIdx
                                ? "bg-blue-600 text-white shadow-xs shadow-blue-500/20 dark:bg-blue-500"
                                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-300 dark:hover:bg-gray-800"
                            }`}
                          >
                            {p.sem ? p.sem.replace(/-/g, " ").toUpperCase() : `Paper ${pIdx + 1}`}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Action Bar */}
                    {currentPaper && (
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 dark:border-gray-800 dark:bg-gray-900">
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                            File: {currentPaper.file}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://drive.google.com/uc?export=download&id=${currentPaper.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Download PDF"
                            aria-label={`Download ${currentPaper.file}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Embedded Iframe */}
                    {currentPaper && currentPaper.id && (
                      <div className="relative aspect-4/3 sm:aspect-16/10 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-inner dark:border-gray-800">
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
