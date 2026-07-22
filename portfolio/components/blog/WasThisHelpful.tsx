"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export function WasThisHelpful() {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  return (
    <div className="rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-6 my-8">
      <p className="text-center text-[var(--blog-text)] font-medium mb-4">
        Was this helpful?
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setFeedback("up")}
          aria-label="Yes, this was helpful"
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
            feedback === "up"
              ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
              : "border-[var(--blog-border)] text-[var(--blog-text-secondary)] hover:border-[var(--blog-accent)] hover:text-[var(--blog-accent)]"
          }`}
        >
          <ThumbsUp className="h-4 w-4" />
          <span>Yes</span>
        </button>
        <button
          type="button"
          onClick={() => setFeedback("down")}
          aria-label="No, this was not helpful"
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
            feedback === "down"
              ? "border-red-500 bg-red-500/10 text-red-600"
              : "border-[var(--blog-border)] text-[var(--blog-text-secondary)] hover:border-[var(--blog-accent)] hover:text-[var(--blog-accent)]"
          }`}
        >
          <ThumbsDown className="h-4 w-4" />
          <span>No</span>
        </button>
      </div>
      {feedback && (
        <p className="mt-4 text-center text-sm text-[var(--blog-text-muted)]">
          Thanks for your feedback!
        </p>
      )}
    </div>
  );
}
