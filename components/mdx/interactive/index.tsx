"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Accordion                                                                 */
/* -------------------------------------------------------------------------- */

export interface AccordionItem {
  title: string;
  body: ReactNode;
}

interface AccordionProps {
  /** Programmatic API: array of { title, body } items. */
  items?: AccordionItem[];
  /**
   * MDX-friendly API: section title for a single accordion item whose body
   * is rendered as children. Posts are written as:
   *
   *   <Accordion title="Practice Questions">
   *     …markdown body…
   *   </Accordion>
   *
   * which previously rendered as an empty box because the component only
   * understood `items`. This prop + children support restores the missing
   * content.
   */
  title?: string;
  children?: ReactNode;
  defaultOpen?: number;
}

export function Accordion(props: AccordionProps) {
  const { defaultOpen } = props;

  const items: AccordionItem[] = props.items
    ? props.items
    : props.children !== undefined
      ? [{ title: props.title ?? "", body: props.children }]
      : [];

  const [open, setOpen] = useState<number | null>(defaultOpen ?? 0);

  if (items.length === 0) return null;

  return (
    <div className="my-6 divide-y divide-[var(--blog-border)] rounded-lg border border-[var(--blog-border)] not-prose">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left font-medium text-[var(--blog-text)] hover:bg-[var(--blog-surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blog-accent)]"
              aria-expanded={isOpen}
            >
              <span>{it.title}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 text-[var(--blog-text-secondary)]">{it.body}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  FAQ — semantic wrapper that emits FAQPage JSON-LD                         */
/* -------------------------------------------------------------------------- */

interface FaqItem {
  question: string;
  answer: ReactNode;
}

interface FAQProps {
  items?: FaqItem[];
  children?: ReactNode;
}

export function FAQ({ items, children }: FAQProps) {
  const faqItems = items ?? (children ? parseFaqItems(children) : []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: stringifyAnswer(it.answer) },
    })),
  };
  return (
    <div className="my-6 not-prose">
      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <dl className="divide-y divide-[var(--blog-border)] rounded-lg border border-[var(--blog-border)]">
        {faqItems.map((it, i) => (
          <div key={i} className="px-4 py-3">
            <dt className="font-semibold text-[var(--blog-text)]">{it.question}</dt>
            <dd className="mt-1 text-[var(--blog-text-secondary)]">{it.answer}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function stringifyAnswer(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(stringifyAnswer).join(" ");
  if (node && typeof node === "object" && "props" in node) {
    return stringifyAnswer((node as { props: { children: ReactNode } }).props.children);
  }
  return "";
}

function stringifyChildren(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(stringifyChildren).join(" ");
  if (node && typeof node === "object" && "props" in node) {
    return stringifyChildren((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

function parseFaqItems(children: ReactNode): FaqItem[] {
  const text = stringifyChildren(children);
  const items: FaqItem[] = [];
  const regex = /\*\*Question\*\*:\s*([^]*?)\s*\*\*Answer\*\*:\s*([^]*?)(?=\*\*Question\*\*:|$)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    items.push({ question: match[1].trim(), answer: match[2].trim() });
  }
  return items;
}

/* -------------------------------------------------------------------------- */
/*  Mermaid — lazy-loaded (the lib is heavy)                                  */
/* -------------------------------------------------------------------------- */

import dynamic from "next/dynamic";

export const Mermaid = dynamic(
  () => import("./mermaid-client").then((m) => m.MermaidClient),
  { ssr: false, loading: () => <div className="my-6 rounded bg-[var(--blog-surface)] p-4 text-sm text-[var(--blog-text-muted)]">Rendering diagram…</div> }
);
