import Image from "next/image";
import type { ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*  ResponsiveTable                                                           */
/* -------------------------------------------------------------------------- */

export function ResponsiveTable({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 overflow-x-auto">
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  ComparisonTable                                                           */
/* -------------------------------------------------------------------------- */

interface ComparisonTableProps {
  headers?: string[];
  rows?: string[][];
  caption?: string;
}

export function ComparisonTable({ headers, rows, caption }: ComparisonTableProps) {
  const safeHeaders = headers ?? [];
  const safeRows    = rows    ?? [];

  if (safeHeaders.length === 0 && safeRows.length === 0) return null;

  return (
    <figure className="my-6 not-prose">
      <div className="overflow-x-auto rounded-md border border-[var(--blog-border)]">
        <table className="w-full border-collapse text-sm">
          {caption && (
            <caption className="border-b border-[var(--blog-border)] bg-[var(--blog-surface)] px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-[var(--blog-text-muted)]">
              {caption}
            </caption>
          )}

          <thead>
            <tr>
              {safeHeaders.map((h, i) => (
                <th
                  key={i}
                  scope="col"
                  className="border-b-2 border-[var(--blog-border)] bg-[var(--blog-surface)] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--blog-text-muted)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--blog-border)]">
            {safeRows.map((row, ri) => (
              <tr
                key={ri}
                className={`transition-colors hover:bg-[var(--blog-surface)] ${
                  ri % 2 !== 0 ? "bg-[var(--blog-bg)]/60" : ""
                }`}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="px-4 py-3 text-sm align-top text-[var(--blog-text-secondary)]"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/*  Figure                                                                    */
/* -------------------------------------------------------------------------- */

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export function Figure({ src, alt, caption, width, height }: FigureProps) {
  const hasDimensions = Boolean(width && height);

  if (hasDimensions) {
    return (
      <figure className="my-6 not-prose">
        <Image
          src={src}
          alt={alt || ""}
          width={width!}
          height={height!}
          className="w-full rounded-md border border-[var(--blog-border)] shadow-sm"
          style={{ height: "auto" }}
        />
        {caption && (
          <figcaption className="mt-2 text-center text-sm text-[var(--blog-text-muted)]">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className="my-6 not-prose">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full rounded-md border border-[var(--blog-border)] shadow-sm"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-[var(--blog-text-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
