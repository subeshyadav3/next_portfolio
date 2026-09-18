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
  ChevronDown,
  ChevronUp,
  FileText,
  ExternalLink,
  Layers,
  Check,
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
 * - Ultra-compact unified single-row header (saves ~80px vertical space)
 * - Multi-paper dropdown selector with quick arrow navigation (Left/Right keys)
 * - Collapsible Zen / Focus mode for 100% full-screen reading
 * - Mobile-safe embed handling (Drive preview / Google Docs fallback)
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isNativeFs, setIsNativeFs] = useState(false);
  const [activeIdx, setActiveIdx] = useState(activePaperIndex);
  const [isMobile, setIsMobile] = useState(false);
  const [viewerEngine, setViewerEngine] = useState<"auto" | "cdn" | "drive">("auto");
  const [paperDropdownOpen, setPaperDropdownOpen] = useState(false);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

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
      const isMob =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
        window.innerWidth < 768;
      setIsMobile(isMob);
    };
    checkMobile();
  }, []);

  const hasMultiple = Boolean(papers && papers.length > 1);
  const currentPaper =
    papers && papers.length > 0 ? papers[Math.min(activeIdx, papers.length - 1)] : null;

  const currentPaperSemLabel = currentPaper?.sem
    ? currentPaper.sem.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())
    : `Paper ${activeIdx + 1}`;

  const currentTitle = currentPaper
    ? `${subjectTitle ? `${subjectTitle} — ` : ""}${currentPaper.file}`
    : title ?? "PDF Document";

  const currentDownloadUrl = currentPaper?.downloadUrl ?? downloadUrl ?? src;
  const currentDriveId = currentPaper?.id;

  // Choose the best embed URL
  const embedUrl = useMemo(() => {
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

  const handleSelectPaper = useCallback(
    (index: number) => {
      setActiveIdx(index);
      onPaperSelect?.(index);
    },
    [onPaperSelect]
  );

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

  // Close dropdown on click outside
  useEffect(() => {
    if (!paperDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPaperDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [paperDropdownOpen]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (paperDropdownOpen) {
          setPaperDropdownOpen(false);
        } else {
          exit();
        }
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
  }, [exit, hasMultiple, papers, onPaperSelect, paperDropdownOpen]);

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`PDF viewer: ${currentTitle}`}
      className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 backdrop-blur-sm"
    >
      {/* ── Compact Floating Pill (Zen Mode: when header is collapsed) ── */}
      {isHeaderCollapsed && (
        <div className="absolute top-2.5 right-3 z-30 flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-900/90 py-1 px-2 shadow-2xl backdrop-blur-md transition-all hover:bg-slate-900">
          {hasMultiple && (
            <button
              type="button"
              onClick={() => {
                setIsHeaderCollapsed(false);
                setPaperDropdownOpen(true);
              }}
              className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-slate-200 hover:text-white"
            >
              <FileText className="h-3.5 w-3.5 text-blue-400" />
              <span>{currentPaperSemLabel}</span>
              <span className="text-[10px] text-slate-400">
                ({activeIdx + 1}/{papers?.length})
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsHeaderCollapsed(false)}
            title="Expand toolbar"
            aria-label="Expand toolbar"
            className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <ChevronDown className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-[11px]">Toolbar</span>
          </button>

          <button
            type="button"
            onClick={exit}
            title="Exit full view (Esc)"
            aria-label="Exit full view"
            className="rounded-full bg-blue-600 p-1 text-white hover:bg-blue-500 transition"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Single Unified Slim Header Bar (40px) ── */}
      {!isHeaderCollapsed && (
        <div className="relative z-20 flex h-11 shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-slate-900/95 px-3 backdrop-blur-sm sm:px-4">
          {/* Left: Paper Selector Dropdown or Document Icon */}
          <div className="flex min-w-0 items-center gap-1.5">
            {hasMultiple && papers ? (
              <div className="relative flex items-center gap-1" ref={dropdownRef}>
                {/* Dropdown Trigger Button */}
                <button
                  type="button"
                  onClick={() => setPaperDropdownOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white shadow-xs transition hover:bg-white/15 focus:outline-hidden"
                  aria-expanded={paperDropdownOpen}
                  aria-haspopup="listbox"
                  title="Switch between available papers"
                >
                  <FileText className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span className="truncate max-w-[130px] sm:max-w-[200px]">
                    {currentPaperSemLabel}
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    ({activeIdx + 1}/{papers.length})
                  </span>
                  {currentPaper?.isCrossSemester && (
                    <span className="rounded bg-amber-400/25 px-1 py-0.2 text-[9px] font-bold text-amber-300">
                      Cross
                    </span>
                  )}
                  <ChevronDown
                    className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${
                      paperDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Quick arrow pagination next to dropdown */}
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    disabled={activeIdx === 0}
                    onClick={() => handleSelectPaper(activeIdx - 1)}
                    title="Previous paper (← key)"
                    className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-20 transition"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={activeIdx === papers.length - 1}
                    onClick={() => handleSelectPaper(activeIdx + 1)}
                    title="Next paper (→ key)"
                    className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-20 transition"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Dropdown Popover */}
                {paperDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1.5 z-50 w-72 sm:w-80 rounded-xl border border-white/15 bg-slate-900/98 p-1.5 shadow-2xl backdrop-blur-xl ring-1 ring-black/40">
                    <div className="flex items-center justify-between border-b border-white/10 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      <span>Available Papers ({papers.length})</span>
                      <span className="text-[10px] font-normal text-slate-500">
                        Use ← / → keys
                      </span>
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-1 py-1">
                      {papers.map((p, idx) => {
                        const isSelected = idx === activeIdx;
                        const semLabel = p.sem
                          ? p.sem.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())
                          : `Paper ${idx + 1}`;

                        return (
                          <button
                            key={p.id || idx}
                            type="button"
                            onClick={() => {
                              handleSelectPaper(idx);
                              setPaperDropdownOpen(false);
                            }}
                            className={`flex w-full items-start justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition ${
                              isSelected
                                ? "bg-blue-600 text-white font-medium shadow-xs"
                                : "text-slate-300 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <FileText className="h-3.5 w-3.5 shrink-0" />
                                <span className="font-semibold">{semLabel}</span>
                                {p.isCrossSemester && (
                                  <span className="rounded bg-amber-400/25 px-1.5 py-0.2 text-[9px] font-bold text-amber-300">
                                    Cross-Prog
                                  </span>
                                )}
                              </div>
                              {p.file && (
                                <p
                                  className={`mt-0.5 truncate text-[11px] ${
                                    isSelected ? "text-blue-100" : "text-slate-400"
                                  }`}
                                >
                                  {p.file}
                                </p>
                              )}
                            </div>
                            {isSelected && (
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {currentPaper?.isCrossSemester && (
                      <div className="mt-1 border-t border-white/10 px-2.5 pt-1.5 text-[10px] leading-relaxed text-amber-300/90">
                        ⚠️ Note: This paper is archived from another IOE program track sharing this course syllabus.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 truncate">
                <FileText className="h-4 w-4 shrink-0 text-blue-400" />
                <h2 className="truncate text-xs font-semibold text-white sm:text-sm">
                  {currentTitle}
                </h2>
              </div>
            )}

            {/* Subtle subject title display */}
            {hasMultiple && subjectTitle && (
              <span className="hidden lg:inline truncate text-xs text-slate-400 max-w-[220px] xl:max-w-sm pl-2 border-l border-white/10">
                {subjectTitle}
              </span>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            {/* Viewer Engine Switcher */}
            {currentDriveId && (
              <button
                type="button"
                onClick={() =>
                  setViewerEngine((curr) => (curr === "drive" ? "cdn" : "drive"))
                }
                title={`Switch viewer engine (currently ${
                  viewerEngine === "drive" || (viewerEngine === "auto" && isMobile)
                    ? "Drive Mirror"
                    : "Cloudinary CDN"
                })`}
                className="hidden md:inline-flex h-8 items-center gap-1 rounded-lg border border-white/15 px-2 text-[11px] font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <Layers className="h-3 w-3 text-blue-400" />
                <span>
                  {viewerEngine === "drive" || (viewerEngine === "auto" && isMobile)
                    ? "Drive"
                    : "CDN"}
                </span>
              </button>
            )}

            {/* Direct Open File */}
            {currentDownloadUrl && (
              <a
                href={currentDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open direct file in new tab"
                aria-label="Open direct file in new tab"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <ExternalLink className="h-3.5 w-3.5" />
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
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <Download className="h-3.5 w-3.5" />
              </a>
            )}

            {/* Device Fullscreen toggle */}
            <button
              type="button"
              onClick={toggleNativeFs}
              title={isNativeFs ? "Exit device fullscreen" : "Device fullscreen"}
              aria-label={isNativeFs ? "Exit device fullscreen" : "Device fullscreen"}
              className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {isNativeFs ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>

            {/* Collapse Toolbar (Zen / Full Space Mode) */}
            <button
              type="button"
              onClick={() => setIsHeaderCollapsed(true)}
              title="Hide toolbar for maximum reading space"
              aria-label="Hide toolbar"
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-white/15 px-2 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <ChevronUp className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-[11px]">Hide Bar</span>
            </button>

            {/* Exit Modal */}
            <button
              type="button"
              onClick={exit}
              title="Exit full view (Esc)"
              aria-label="Exit full view"
              className="inline-flex h-8 items-center gap-1 rounded-lg bg-blue-600 px-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
            >
              <X className="h-3.5 w-3.5" />
              <span>Exit</span>
            </button>
          </div>
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
