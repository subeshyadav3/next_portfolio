"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { IoePaper } from "@/lib/ioe/types";
import {
  Download,
  Minimize2,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Info,
  ExternalLink,
  Layers,
} from "lucide-react";

interface PdfOverlayProps {
  src?: string;
  title?: string;
  downloadUrl?: string;
  onClose: () => void;
  papers?: IoePaper[];
  activePaperIndex?: number;
  onPaperSelect?: (index: number) => void;
  subjectTitle?: string;
}

/**
 * Full-screen in-site PDF overlay with:
 * - Multi-paper tab toggling & keyboard navigation (Left/Right arrows)
 * - Mobile-safe embed handling (Drive preview / Google Docs viewer fallback preventing Chrome iframe blocks)
 * - Viewer engine switcher (Cloudinary CDN vs Drive Mirror)
 * - Fullscreen, Esc to exit, and body scroll lock.
 */
export function PdfOverlay({
  src,
  title,
  downloadUrl,
  onClose,
  papers,
  activePaperIndex = 0,
  onPaperSelect,
  subjectTitle,
}: PdfOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNativeFs, setIsNativeFs] = useState(false);
  const [activeIdx, setActiveIdx] = useState(activePaperIndex);
  const [isMobile, setIsMobile] = useState(false);
  const [viewerEngine, setViewerEngine] = useState<"auto" | "cdn" | "drive">("auto");

  // Sync external index if updated
  useEffect(() => {
    if (activePaperIndex !== undefined && activePaperIndex !== activeIdx) {
      setActiveIdx(activePaperIndex);
    }
  }, [activePaperIndex]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
      const isMob = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || window.innerWidth < 768;
      setIsMobile(isMob);
    };
    checkMobile();
  }, []);

  const hasMultiple = Boolean(papers && papers.length > 1);
  const currentPaper = papers && papers.length > 0
    ? papers[Math.min(activeIdx, papers.length - 1)]
    : null;

  const currentTitle = currentPaper
    ? `${subjectTitle ? `${subjectTitle} — ` : ""}${currentPaper.file}`
    : title ?? "PDF Document";

  const currentDownloadUrl = currentPaper?.downloadUrl ?? downloadUrl ?? src;
  const currentDriveId = currentPaper?.id;

  // Choose the best embed URL
  const embedUrl = useMemo(() => {
    // If user explicitly chose Drive mirror or if on Mobile in 'auto' mode:
    const useDrive = viewerEngine === "drive" || (viewerEngine === "auto" && isMobile);
    if (useDrive && currentDriveId) {
      return `https://drive.google.com/file/d/${currentDriveId}/preview`;
    }

    if (viewerEngine === "cdn" && currentPaper?.previewUrl) {
      return currentPaper.previewUrl;
    }

    if (isMobile) {
      if (currentDriveId) {
        return `https://drive.google.com/file/d/${currentDriveId}/preview`;
      }
      const raw = currentPaper?.previewUrl ?? src ?? "";
      return `https://docs.google.com/viewer?url=${encodeURIComponent(raw)}&embedded=true`;
    }

    return currentPaper?.previewUrl ?? src ?? "";
  }, [viewerEngine, isMobile, currentDriveId, currentPaper, src]);

  const handleSelectPaper = useCallback((index: number) => {
    setActiveIdx(index);
    onPaperSelect?.(index);
  }, [onPaperSelect]);

  const exit = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    onClose();
  }, [onClose]);

  const toggleNativeFs = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      containerRef.current?.requestFullscreen?.().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        exit();
      } else if (hasMultiple && papers) {
        if (e.key === "ArrowLeft") {
          setActiveIdx((prev) => {
            const next = Math.max(0, prev - 1);
            onPaperSelect?.(next);
            return next;
          });
        } else if (e.key === "ArrowRight") {
          setActiveIdx((prev) => {
            const next = Math.min(papers.length - 1, prev + 1);
            onPaperSelect?.(next);
            return next;
          });
        }
      }
    };
    const onFsChange = () => setIsNativeFs(Boolean(document.fullscreenElement));
    document.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFsChange);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFsChange);
      document.body.style.overflow = prevOverflow;
    };
  }, [exit, hasMultiple, papers, onPaperSelect]);

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`PDF viewer: ${currentTitle}`}
      className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 backdrop-blur-sm"
    >
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-slate-900/90 px-3.5 py-2.5 sm:px-4">
        <div className="min-w-0 flex-1 pr-2">
          <h2 className="truncate text-xs sm:text-sm font-semibold text-white">{currentTitle}</h2>
          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10px] sm:text-[11px] text-slate-400">
            <span>Reading in full view</span>
            {hasMultiple && (
              <span className="hidden sm:inline text-slate-500">
                · Use ← / → arrows to switch papers
              </span>
            )}
            {isMobile && (
              <span className="rounded bg-blue-900/50 px-1.5 py-0.2 text-[10px] font-medium text-blue-300">
                Mobile Safe View
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Viewer Engine Switcher */}
          {currentDriveId && (
            <button
              type="button"
              onClick={() =>
                setViewerEngine((curr) =>
                  curr === "drive" ? "cdn" : "drive"
                )
              }
              title={`Switch viewer engine (currently ${viewerEngine === "drive" || (viewerEngine === "auto" && isMobile) ? "Drive Mirror" : "Cloudinary CDN"})`}
              className="hidden md:inline-flex items-center gap-1 rounded-lg border border-white/15 px-2.5 py-1.5 text-[11px] font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <Layers className="h-3 w-3 text-blue-400" />
              <span>
                {viewerEngine === "drive" || (viewerEngine === "auto" && isMobile) ? "Drive Mirror" : "CDN View"}
              </span>
            </button>
          )}

          {/* Open Native in mobile or new tab */}
          {currentDownloadUrl && (
            <a
              href={currentDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open direct file in new tab"
              className="inline-flex h-8 sm:h-9 items-center gap-1 rounded-lg border border-white/15 px-2 sm:px-2.5 text-xs text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Open</span>
            </a>
          )}

          {/* Download PDF */}
          {currentDownloadUrl && (
            <a
              href={currentDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Download PDF"
              aria-label="Download PDF"
              className="inline-flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center rounded-lg border border-white/15 text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </a>
          )}

          {/* Device Fullscreen toggle */}
          <button
            type="button"
            onClick={toggleNativeFs}
            title={isNativeFs ? "Exit device fullscreen" : "Use device fullscreen"}
            aria-label={isNativeFs ? "Exit device fullscreen" : "Use device fullscreen"}
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            {isNativeFs ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          {/* Exit Modal */}
          <button
            type="button"
            onClick={exit}
            title="Exit full view (Esc)"
            aria-label="Exit full view"
            className="inline-flex h-8 sm:h-9 items-center gap-1 rounded-lg bg-blue-600 px-2.5 sm:px-3 text-xs font-semibold text-white transition hover:bg-blue-500"
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* ── Multi-Paper Selector Toolbar (when > 1 paper) ── */}
      {hasMultiple && papers && (
        <div className="flex items-center justify-between gap-2 overflow-x-auto border-b border-white/10 bg-slate-900/95 px-3.5 py-2">
          <div className="flex items-center gap-1.5">
            <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Papers:
            </span>
            {papers.map((p, idx) => {
              const isSelected = idx === activeIdx;
              const semLabel = p.sem
                ? p.sem.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())
                : `Paper ${idx + 1}`;

              return (
                <button
                  key={p.id || idx}
                  type="button"
                  onClick={() => handleSelectPaper(idx)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  <FileText className="h-3 w-3" />
                  <span>{semLabel}</span>
                  {p.isCrossSemester && (
                    <span className="rounded bg-amber-400/20 px-1 py-0.2 text-[9px] font-bold text-amber-300">
                      Cross-Prog
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-1 pl-2">
            <button
              type="button"
              disabled={activeIdx === 0}
              onClick={() => handleSelectPaper(activeIdx - 1)}
              title="Previous paper"
              className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30 transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-medium text-slate-400 tabular-nums">
              {activeIdx + 1}/{papers.length}
            </span>
            <button
              type="button"
              disabled={activeIdx === papers.length - 1}
              onClick={() => handleSelectPaper(activeIdx + 1)}
              title="Next paper"
              className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30 transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Cross-Program Notice (if active paper is cross-program) ── */}
      {currentPaper?.isCrossSemester && (
        <div className="flex items-center gap-2 border-b border-amber-500/20 bg-amber-950/40 px-4 py-1.5 text-xs text-amber-300">
          <Info className="h-3.5 w-3.5 shrink-0 text-amber-400" />
          <span>
            This past paper ({currentPaper.sem.replace(/-/g, " ")}) was archived from another IOE program/semester track sharing the same course syllabus.
          </span>
        </div>
      )}

      {/* ── Main PDF iframe viewer ── */}
      <div className="relative flex-1 bg-slate-900">
        <iframe
          key={embedUrl}
          src={embedUrl}
          title={currentTitle}
          className="h-full w-full border-0 bg-white"
          allow="fullscreen"
        />
      </div>
    </div>
  );
}
