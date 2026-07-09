import type { ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*  ResponsiveTable — wraps <table> in a horizontal scroll container          */
/* -------------------------------------------------------------------------- */

export function ResponsiveTable({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 -mx-4 overflow-x-auto sm:mx-0 sm:rounded-lg sm:border sm:border-[var(--blog-border)] not-prose">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-[var(--blog-border)] text-sm">
          {children}
        </table>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  ComparisonTable — accepts a headers + rows data shape                     */
/* -------------------------------------------------------------------------- */

interface ComparisonTableProps {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export function ComparisonTable({ headers, rows, caption }: ComparisonTableProps) {
  return (
    <figure className="my-6 not-prose">
      <div className="-mx-4 overflow-x-auto sm:mx-0 sm:rounded-lg sm:border sm:border-[var(--blog-border)]">
        <table className="min-w-full divide-y divide-[var(--blog-border)] text-sm">
          {caption && (
            <caption className="px-4 py-2 text-left text-sm font-medium text-[var(--blog-text-muted)]">
              {caption}
            </caption>
          )}
          <thead className="bg-[var(--blog-surface)]">
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  scope="col"
                  className="px-4 py-3 text-left font-semibold text-[var(--blog-text)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--blog-border)]">
            {rows.map((row, ri) => (
              <tr key={ri} className="hover:bg-[var(--blog-surface)]/50">
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="px-4 py-3 text-[var(--blog-text-secondary)]"
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
/*  Figure — semantic wrapper for an image with caption                       */
/* -------------------------------------------------------------------------- */

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export function Figure({ src, alt, caption, width, height }: FigureProps) {
  return (
    <figure className="my-6 not-prose">
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        className="w-full rounded-lg"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-[var(--blog-text-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
