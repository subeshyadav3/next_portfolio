"use client";

import { useState } from "react";
import type { IoePaper } from "@/lib/ioe/types";
import { Download, ExternalLink, FileText, Info } from "lucide-react";

interface PdfViewerProps {
  papers: IoePaper[];
}

/**
 * Embedded Google Drive PDF viewer with paper/year tabs, action toolbar,
 * and direct download fallback.
 */
export function PdfViewer({ papers }: PdfViewerProps) {
  const [active, setActive] = useState(0);
  const paper = papers[Math.min(active, papers.length - 1)];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-colors dark:border-gray-800 dark:bg-gray-900">
      {papers.length > 1 && (
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 bg-slate-50 p-3 dark:border-gray-800 dark:bg-gray-950">
          <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Available Papers:
          </span>
          {papers.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActive(i)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                i === active
                  ? "bg-blue-600 text-white shadow-xs shadow-blue-500/20 dark:bg-blue-500"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-300 dark:hover:bg-gray-800 dark:hover:text-white"
              }`}
            >
              <FileText className="h-3 w-3" />
              {p.sem.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 sm:flex">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
              {paper.file}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Official IOE Exam Paper
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href={paper.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Drive / New Tab"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 dark:border-gray-800 dark:bg-gray-800 dark:text-slate-300 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Drive View</span>
          </a>
          <a
            href={paper.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs shadow-blue-500/20 transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Download PDF
          </a>
        </div>
      </div>

      <div className="relative border-t border-slate-200 bg-slate-100 dark:border-gray-800 dark:bg-gray-950">
        <iframe
          key={paper.id}
          src={paper.previewUrl}
          title={paper.file}
          className="h-[52vh] min-h-[360px] sm:h-[68vh] sm:min-h-[480px] w-full border-0"
          loading="lazy"
          allow="autoplay"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500 dark:border-gray-800 dark:bg-gray-950 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span>If preview is slow to load or blocked, use direct download.</span>
        </div>
        <a
          href={paper.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-600 hover:underline dark:text-blue-400 shrink-0"
        >
          Direct Download ↗
        </a>
      </div>
    </div>
  );
}
