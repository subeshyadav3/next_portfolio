"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Minimize2, Maximize2, X } from "lucide-react";

interface PdfOverlayProps {
  src: string;
  title: string;
  onClose: () => void;
}

/**
 * Full-screen in-site PDF overlay. Keeps visitors on the site while giving a
 * distraction-free reading mode. Supports native fullscreen (with graceful
 * fallback to a fixed viewport overlay), Esc to exit, and body scroll lock.
 */
export function PdfOverlay({ src, title, onClose }: PdfOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNativeFs, setIsNativeFs] = useState(false);

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
      if (e.key === "Escape") exit();
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
  }, [exit]);

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`PDF viewer: ${title}`}
      className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-slate-900/90 px-4 py-2.5">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-white">{title}</h2>
          <p className="text-[11px] text-slate-400">Reading in full view — press Esc or ✕ to exit</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={toggleNativeFs}
            title={isNativeFs ? "Exit device fullscreen" : "Use device fullscreen"}
            aria-label={isNativeFs ? "Exit device fullscreen" : "Use device fullscreen"}
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            {isNativeFs ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={exit}
            title="Exit full view (Esc)"
            aria-label="Exit full view"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white transition hover:bg-blue-500"
          >
            <X className="h-4 w-4" />
            Exit
          </button>
        </div>
      </div>

      <iframe
        src={src}
        title={title}
        className="h-full w-full flex-1 border-0 bg-white"
        allow="fullscreen"
      />
    </div>
  );
}
