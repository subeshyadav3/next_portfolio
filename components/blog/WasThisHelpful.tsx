"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, CheckCircle2 } from "lucide-react";

export function WasThisHelpful() {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  return (
    <div className="rounded-2xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-6 my-10 shadow-xs text-center transition-all">
      {feedback ? (
        <div className="flex flex-col items-center justify-center py-2 animate-in fade-in duration-300">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mb-2">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-[var(--blog-text)]">
            Thank you for your feedback!
          </p>
          <p className="mt-1 text-xs text-[var(--blog-text-muted)]">
            Your response helps us improve the quality of our educational notes.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm font-semibold text-[var(--blog-text)] mb-1">
            Did you find this article helpful?
          </p>
          <p className="text-xs text-[var(--blog-text-muted)] mb-4">
            Help us improve our study guides and literary content
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setFeedback("up")}
              aria-label="Yes, this was helpful"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--blog-border)] bg-[var(--blog-bg)] px-5 py-2.5 text-xs font-semibold text-[var(--blog-text)] transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-600"
            >
              <ThumbsUp className="h-4 w-4" />
              <span>Yes, helpful</span>
            </button>
            <button
              type="button"
              onClick={() => setFeedback("down")}
              aria-label="No, this was not helpful"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--blog-border)] bg-[var(--blog-bg)] px-5 py-2.5 text-xs font-semibold text-[var(--blog-text)] transition-all hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-600"
            >
              <ThumbsDown className="h-4 w-4" />
              <span>Needs work</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
