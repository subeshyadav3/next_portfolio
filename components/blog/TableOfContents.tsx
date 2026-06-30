"use client";

import Link from "next/link";
import { TocItem } from "@/lib/blog/types";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-[var(--blog-border)] bg-[var(--blog-surface)] p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--blog-text)] mb-4">
        Table of Contents
      </h3>
      <nav>
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
            >
              <Link
                href={`#${item.id}`}
                className="block text-sm text-[var(--blog-text-secondary)] hover:text-[var(--blog-accent)] transition-colors line-clamp-2"
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
