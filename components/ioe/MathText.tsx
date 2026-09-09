"use client";

import React, { useEffect, useState, useMemo } from "react";

type KatexRenderer = {
  renderToString: (tex: string, options?: { displayMode?: boolean; throwOnError?: boolean }) => string;
};

let cachedKatex: KatexRenderer | null = null;

interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * Parses and renders text containing LaTeX math:
 * - `$$...$$` as display math
 * - `$...$` as inline math
 * - Plain text safely as text spans
 * Dynamically loads KaTeX on the client to avoid Next.js server-side vendor chunk errors.
 */
export const MathText: React.FC<MathTextProps> = ({ text, className = "" }) => {
  const [renderer, setRenderer] = useState<KatexRenderer | null>(cachedKatex);

  useEffect(() => {
    if (!cachedKatex) {
      import("katex")
        .then((mod) => {
          const k = (mod.default ?? mod) as KatexRenderer;
          cachedKatex = k;
          setRenderer(k);
        })
        .catch(() => {});
    }
  }, []);

  const elements = useMemo(() => {
    if (!text) return null;

    // Pattern to match $$...$$ or $...$
    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        const math = part.slice(2, -2).trim();
        if (renderer) {
          try {
            const html = renderer.renderToString(math, {
              displayMode: true,
              throwOnError: false,
            });
            return (
              <span
                key={index}
                className="my-2 block overflow-x-auto py-1 text-center"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            return <span key={index} className="font-mono text-sm">{part}</span>;
          }
        }
        return <span key={index} className="font-mono text-sm">{part}</span>;
      } else if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
        const math = part.slice(1, -1).trim();
        if (renderer) {
          try {
            const html = renderer.renderToString(math, {
              displayMode: false,
              throwOnError: false,
            });
            return (
              <span
                key={index}
                className="inline-math px-0.5"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            return <span key={index} className="font-mono text-sm">{part}</span>;
          }
        }
        return <span key={index} className="font-mono text-sm">{part}</span>;
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  }, [text, renderer]);

  return <span className={`max-w-full overflow-x-auto ${className}`}>{elements}</span>;
};

