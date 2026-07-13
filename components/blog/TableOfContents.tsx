"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TocItem } from "@/lib/blog/types";

interface TableOfContentsProps {
  items: TocItem[];
  accentColor?: string;
}

interface TocSection {
  id: string;
  text: string;
  children: TocItem[];
}

export function TableOfContents({ items, accentColor }: TableOfContentsProps) {
  const [activeId, setActiveId]   = useState<string>("");
  const [expanded, setExpanded]   = useState<Record<string, boolean>>({});

  const sections = useMemo<TocSection[]>(() => {
    const result: TocSection[] = [];
    let current: TocSection | null = null;
    for (const item of items) {
      if (item.level === 2) {
        current = { id: item.id, text: item.text, children: [] };
        result.push(current);
      } else if (current) {
        current.children.push(item);
      } else {
        current = { id: item.id, text: item.text, children: [] };
        result.push(current);
      }
    }
    return result;
  }, [items]);

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const accent = accentColor || "var(--blog-accent)";
  const toggle = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const tocContent = (
    <ul className="space-y-0.5">
      {sections.map((section) => {
        const isExpanded = !!expanded[section.id];
        const hasChildren = section.children.length > 0;
        const isActive = activeId === section.id;

        return (
          <li key={section.id}>
            <div className="flex items-start gap-1">
              <Link
                href={`#${section.id}`}
                className={`flex-1 block text-sm leading-snug border-l-2 pl-3 py-1 rounded-r-sm transition-all ${
                  isActive
                    ? "border-current font-semibold bg-[var(--blog-accent)]/8"
                    : "border-transparent text-[var(--blog-text-secondary)] hover:text-[var(--blog-text)] hover:border-[var(--blog-border)]"
                }`}
                style={isActive ? { color: accent } : undefined}
              >
                {section.text}
              </Link>

              {hasChildren && (
                <button
                  type="button"
                  onClick={() => toggle(section.id)}
                  aria-expanded={isExpanded}
                  aria-label={`${isExpanded ? "Hide" : "Show"} ${section.children.length} subheadings`}
                  className="shrink-0 rounded p-1 text-[var(--blog-text-muted)] hover:bg-[var(--blog-surface)] hover:text-[var(--blog-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blog-accent)] transition-colors"
                >
                  <ChevronIcon className={isExpanded ? "rotate-180" : ""} />
                </button>
              )}
            </div>

            {hasChildren && isExpanded && (
              <ul className="mt-0.5 ml-3 space-y-0.5 border-l border-[var(--blog-border)] pl-3">
                {section.children.map((child) => {
                  const ca = activeId === child.id;
                  return (
                    <li key={child.id}>
                      <Link
                        href={`#${child.id}`}
                        className={`block text-[0.8125rem] py-0.5 leading-snug transition-colors ${
                          ca
                            ? "font-semibold"
                            : "text-[var(--blog-text-muted)] hover:text-[var(--blog-text-secondary)]"
                        }`}
                        style={ca ? { color: accent } : undefined}
                      >
                        {child.text}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Mobile: collapsible */}
      <details className="lg:hidden rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-5">
        <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wider text-[var(--blog-text)] select-none">
          Table of Contents
        </summary>
        <nav className="mt-4" aria-label="Table of contents">
          {tocContent}
        </nav>
      </details>

      {/* Desktop: sticky inside parent grid column */}
      <div className="hidden lg:block self-start sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-5" style={{ scrollbarWidth: "thin", scrollbarColor: "var(--blog-border) transparent" }}>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--blog-text-muted)]">
          Table of Contents
        </h2>
        <nav aria-label="Table of contents">
          {tocContent}
        </nav>
      </div>
    </>
  );
}

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-3.5 w-3.5 transition-transform duration-150 ${className}`}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}
