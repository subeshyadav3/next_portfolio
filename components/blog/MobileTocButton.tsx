"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TocItem } from "@/lib/blog/types";
import { ChevronDown, X, List } from "lucide-react";

interface MobileTocButtonProps {
  items: TocItem[];
  accentColor?: string;
}

interface TocSection {
  id: string;
  text: string;
  children: TocItem[];
}

export function MobileTocButton({ items, accentColor }: MobileTocButtonProps) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const sheetRef = useRef<HTMLDivElement>(null);

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

  // Scroll tracking for active section
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

  // Scroll active item into view in the sheet
  useEffect(() => {
    if (!open || !activeId) return;
    const el = sheetRef.current?.querySelector(`[data-toc-id="${activeId}"]`);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [open, activeId]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  if (items.length === 0) return null;

  const accent = accentColor || "var(--blog-accent)";

  // Find current section label
  const currentSection = sections.find((s) => s.id === activeId);
  const currentLabel = currentSection?.text || sections[0]?.text || "Contents";

  return (
    <>
      {/* Floating button — bottom-left to not conflict with BackToTop */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open table of contents"
        className="fixed bottom-8 left-4 z-50 flex h-12 items-center gap-2 rounded-full border border-[var(--blog-border)] bg-[var(--blog-surface)] px-4 text-sm font-medium text-[var(--blog-text)] shadow-lg backdrop-blur-md transition-all hover:shadow-xl hover:border-[var(--blog-accent)] lg:hidden"
      >
        <List className="h-4 w-4 shrink-0" style={{ color: accent }} />
        <span className="max-w-[140px] truncate">{currentLabel}</span>
      </button>

      {/* Bottom sheet overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[60] lg:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" />

          {/* Sheet */}
          <div
            ref={sheetRef}
            className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-2xl border-t border-[var(--blog-border)] bg-[var(--blog-bg)] shadow-2xl animate-in slide-in-from-bottom duration-300"
          >
            {/* Handle */}
            <div className="sticky top-0 z-10 bg-[var(--blog-bg)] px-5 pt-3 pb-2 border-b border-[var(--blog-border)]">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[var(--blog-border)]" />
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--blog-text-muted)]">
                  Table of Contents
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close table of contents"
                  className="rounded-full p-1.5 hover:bg-[var(--blog-surface)] text-[var(--blog-text-muted)] hover:text-[var(--blog-text)] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* TOC items */}
            <nav aria-label="Table of contents" className="p-5">
              <ul className="space-y-1">
                {sections.map((section) => {
                  const hasChildren = section.children.length > 0;
                  const isActive = activeId === section.id;

                  return (
                    <li key={section.id} data-toc-id={section.id}>
                      <a
                        href={`#${section.id}`}
                        onClick={() => setOpen(false)}
                        className={`flex items-center rounded-lg px-3 py-2.5 text-sm leading-snug transition-all ${
                          isActive
                            ? "font-semibold bg-[var(--blog-accent)]/10"
                            : "text-[var(--blog-text-secondary)] hover:bg-[var(--blog-surface)]"
                        }`}
                        style={isActive ? { color: accent } : undefined}
                      >
                        <span
                          className={`mr-3 h-1.5 w-1.5 shrink-0 rounded-full transition-all ${
                            isActive ? "scale-125" : "scale-75 opacity-40"
                          }`}
                          style={isActive ? { backgroundColor: accent } : { backgroundColor: "var(--blog-text-muted)" }}
                        />
                        {section.text}
                      </a>

                      {hasChildren && (
                        <ul className="ml-5 mt-0.5 space-y-0.5 border-l border-[var(--blog-border)] pl-3">
                          {section.children.map((child) => {
                            const ca = activeId === child.id;
                            return (
                              <li key={child.id}>
                                <a
                                  href={`#${child.id}`}
                                  onClick={() => setOpen(false)}
                                  className={`block rounded-md px-3 py-1.5 text-[0.8125rem] leading-snug transition-colors ${
                                    ca
                                      ? "font-semibold"
                                      : "text-[var(--blog-text-muted)] hover:text-[var(--blog-text-secondary)]"
                                  }`}
                                  style={ca ? { color: accent } : undefined}
                                >
                                  {child.text}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
