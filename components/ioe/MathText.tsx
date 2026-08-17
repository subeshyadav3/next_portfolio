"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * Parses and renders text containing LaTeX math:
 * - `$$...$$` as display math
 * - `$...$` as inline math
 * - Plain text safely as text spans
 */
export const MathText: React.FC<MathTextProps> = ({ text, className = "" }) => {
  const elements = useMemo(() => {
    if (!text) return null;

    // Pattern to match $$...$$ or $...$
    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        const math = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, {
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
          return <span key={index}>{part}</span>;
        }
      } else if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
        const math = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(math, {
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
          return <span key={index}>{part}</span>;
        }
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  }, [text]);

  return <span className={`max-w-full overflow-x-auto ${className}`}>{elements}</span>;
};
