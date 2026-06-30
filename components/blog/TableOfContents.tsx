"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TocItem } from "@/lib/blog/types";

interface TableOfContentsProps {
  items: TocItem[];
  accentColor?: string;
}

export function TableOfContents({ items, accentColor }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const tocContent = (
    <ul className="space-y-2">
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
          >
            <Link
              href={`#${item.id}`}
              className={`block text-sm transition-colors line-clamp-2 border-l-2 pl-3 ${
                isActive
                  ? "border-current font-medium"
                  : "border-transparent text-[var(--blog-text-secondary)] hover:text-[var(--blog-text)]"
              }`}
              style={isActive ? { color: accentColor || "var(--blog-accent)" } : undefined}
            >
              {item.text}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Mobile/tablet collapsible */}
      <details className="lg:hidden rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-5">
        <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wider text-[var(--blog-text)]">
          Table of Contents
        </summary>
        <nav className="mt-4">{tocContent}</nav>
      </details>

      {/* Desktop sticky */}
      <div className="hidden lg:block rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--blog-text)] mb-4">
          Table of Contents
        </h3>
        <nav>{tocContent}</nav>
      </div>
    </>
  );
}
