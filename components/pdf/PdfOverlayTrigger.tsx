"use client";

import { useState } from "react";
import { Download, Maximize2 } from "lucide-react";
import { PdfOverlay } from "./PdfOverlay";

interface PdfOverlayTriggerProps {
  src: string;
  viewerSrc?: string;
  label?: string;
}

/**
 * Small client-side action row for embedded PDFs: opens the in-site
 * full-view overlay and offers a direct download.
 */
export function PdfOverlayTrigger({ src, label }: PdfOverlayTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1 font-medium text-[var(--blog-accent)] hover:underline"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          Full view
        </button>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-[var(--blog-accent)] hover:underline"
        >
          <Download className="h-3.5 w-3.5" />
          Download ↓
        </a>
      </span>
      {open && (
        <PdfOverlay src={src} title={label ?? "PDF document"} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
