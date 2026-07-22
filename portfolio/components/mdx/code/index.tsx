"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  CodeBlock                                                                 */
/* -------------------------------------------------------------------------- */

interface CodeBlockProps {
  className?: string;
  children?: React.ReactNode;
  /** Optional title shown above the block. */
  title?: string;
}

/** Detect the language from a className like "language-tsx". */
function getLanguage(className?: string): string {
  if (!className) return "text";
  const m = /language-(\w+)/.exec(className);
  return m?.[1] ?? "text";
}

/** Extract a plain-text string from React children. */
function toText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(toText).join("");
  if (children && typeof children === "object" && "props" in children) {
    return toText((children as { props: { children: React.ReactNode } }).props.children);
  }
  return "";
}

export function CodeBlock({ className, children, title }: CodeBlockProps) {
  const code = toText(children).replace(/\n$/, "");
  const language = getLanguage(className);

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-[var(--blog-border)] bg-[#0d1117] not-prose">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-white/70">
        <span className="font-mono">{title ?? language}</span>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto p-4 text-sm text-white/90">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  CopyButton                                                                */
/* -------------------------------------------------------------------------- */

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      /* no-op */
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs text-white/70 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      aria-label={copied ? "Copied" : "Copy code"}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Copy
        </>
      )}
    </button>
  );
}
