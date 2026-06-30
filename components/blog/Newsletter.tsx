"use client";

import { useState, FormEvent } from "react";
import { Mail, Check, AlertCircle } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("idle");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-8 md:p-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--blog-accent-light)]">
        <Mail className="h-6 w-6 text-[var(--blog-accent)]" />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-[var(--blog-text)]">
        Subscribe to the newsletter
      </h2>
      <p className="mt-2 text-[var(--blog-text-secondary)]">
        Get the latest essays, poems, and study notes delivered to your inbox.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 rounded-lg border border-[var(--blog-border)] bg-[var(--blog-bg)] px-4 py-3 text-[var(--blog-text)] placeholder:text-[var(--blog-text-muted)] focus:border-[var(--blog-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--blog-accent)]/20"
        />
        <button
          type="submit"
          className="rounded-lg bg-[var(--blog-accent)] px-6 py-3 font-medium text-white hover:opacity-90 transition-opacity"
        >
          Subscribe
        </button>
      </form>

      {status === "success" && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-emerald-600">
          <Check className="h-4 w-4" />
          <span>Thanks for subscribing!</span>
        </div>
      )}
      {status === "error" && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>Something went wrong. Please try again.</span>
        </div>
      )}
    </div>
  );
}
