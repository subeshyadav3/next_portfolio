"use client";

import { useState } from "react";
import type { IoePaper } from "@/lib/ioe/types";
import { Download, FileText, Info, Maximize2 } from "lucide-react";
import { PdfOverlay } from "@/components/pdf/PdfOverlay";

interface PdfViewerProps {
  papers: IoePaper[];
}

/**
  * Embedded PDF viewer with paper/year tabs, action toolbar,
 * cross-semester notes, and direct download fallback.
 */
export function PdfViewer({ papers }: PdfViewerProps) {
  const [active, setActive] = useState(0);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const paper = papers[Math.min(active, papers.length - 1)];

  if (!paper) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-colors dark:border-gray-800 dark:bg-gray-900">
      {papers.length > 1 && (
        <div
          role="tablist"
          aria-label="Available past exam papers"
          className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 bg-slate-50 p-3 dark:border-gray-800 dark:bg-gray-950"
        >
          <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Available Papers:
          </span>
          {papers.map((p, i) => {
            const isSelected = i === active;
            const semLabel = p.sem
              ? p.sem.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())
              : `Paper ${i + 1}`;

            return (
              <button
                key={p.id || i}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActive(i)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs shadow-blue-500/20 dark:bg-blue-500"
                    : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-300 dark:hover:bg-gray-800 dark:hover:text-white"
                }`}
              >
                <FileText className="h-3 w-3" />
                <span>{semLabel}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Cross-semester note if paper was compiled from another semester track */}
      {paper.isCrossSemester && (
        <div className="flex items-center gap-2 border-b border-amber-200/70 bg-amber-50/80 px-4 py-2.5 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
          <Info className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            Note: This question paper file ({paper.sem.replace(/-/g, " ")}) was archived from
            an IOE exam session for the common <strong>{paper.subject}</strong> curriculum.
          </span>
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
              IOE Past Examination Paper
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setOverlayOpen(true)}
            title="Read in full view (stays on site)"
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 shadow-xs transition hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-900/50"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Full View</span>
          </button>
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
          allow="fullscreen"
        />
        <button
          type="button"
          onClick={() => setOverlayOpen(true)}
          title="Read in full view (stays on site)"
          aria-label="Read in full view"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900/70 text-white shadow-md backdrop-blur transition hover:bg-slate-900"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {overlayOpen && (
        <PdfOverlay
          src={paper.previewUrl}
          title={paper.file}
          onClose={() => setOverlayOpen(false)}
        />
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500 dark:border-gray-800 dark:bg-gray-950 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span>If preview is slow to load or blocked by your browser, use direct download.</span>
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

      <div className="border-t border-slate-200 bg-white px-4 py-3 text-[11px] leading-relaxed text-slate-500 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-400">
        <p>
          <strong className="font-semibold text-slate-700 dark:text-slate-300">Document information:</strong>{" "}
          This past examination paper is identified as an IOE/TU academic document and was cataloged from a public{" "}
          <a
            href={paper.archiveSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Google Drive archive
          </a>
          . This independent website did not create the examination paper and is not affiliated with TU or IOE.
        </p>
        <p className="mt-1.5">
          Rights holders can request correction or removal by emailing{" "}
          <a
            href={`mailto:subeshgaming@gmail.com?subject=${encodeURIComponent(`IOE document removal request: ${paper.file}`)}`}
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            subeshgaming@gmail.com
          </a>
          {" "}with this page URL and supporting details.
        </p>
      </div>
    </div>
  );
}
