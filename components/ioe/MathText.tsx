"use client";

import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathTextProps {
  text: string;
  className?: string;
}

function renderInlineMath(text: string): React.ReactNode[] {
  if (!text) return [];
  const regex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith("$$") && part.endsWith("$$")) {
      const math = part.slice(2, -2).trim().replace(/µ/g, "\\mu ");
      try {
        const html = katex.renderToString(math, {
          displayMode: true,
          throwOnError: false,
          output: "html",
        });
        return (
          <span
            key={index}
            className="my-2 block overflow-x-auto py-1 text-center"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return <span key={index} className="font-mono text-xs">{part}</span>;
      }
    } else if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
      const math = part.slice(1, -1).trim().replace(/µ/g, "\\mu ");
      try {
        const html = katex.renderToString(math, {
          displayMode: false,
          throwOnError: false,
          output: "html",
        });
        return (
          <span
            key={index}
            className="inline-math px-0.5"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return <span key={index} className="font-mono text-xs">{part}</span>;
      }
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function convertHtmlTableToMarkdown(html: string): string {
  if (!html || !html.includes("<table")) return html;

  return html.replace(/<table[\s\S]*?<\/table\s*>/gi, (match) => {
    const trMatches = match.match(/<tr[\s\S]*?<\/tr>/gi) || [];
    const rows: string[][] = [];
    for (const tr of trMatches) {
      const cellMatches = tr.match(/<(?:th|td)[\s\S]*?<\/(?:th|td)>/gi) || [];
      const cleanCells = cellMatches.map((c) =>
        c.replace(/<[\s\S]*?>/g, "").trim().replace(/\|/g, "&#124;")
      );
      if (cleanCells.length > 0) {
        rows.push(cleanCells);
      }
    }
    if (rows.length === 0) return "";
    const maxCols = Math.max(...rows.map((r) => r.length));
    if (maxCols === 0) return "";
    const paddedRows = rows.map((r) => [...r, ...Array(maxCols - r.length).fill("")]);
    const header = paddedRows[0];
    const separator = Array(maxCols).fill("---");
    const mdLines = [
      `| ${header.join(" | ")} |`,
      `| ${separator.join(" | ")} |`,
      ...paddedRows.slice(1).map((r) => `| ${r.join(" | ")} |`),
    ];
    return `\n\n${mdLines.join("\n")}\n\n`;
  });
}

function parseMarkdownTable(tableLines: string[], keyPrefix: number): React.ReactNode {
  if (tableLines.length < 2) {
    return (
      <div key={keyPrefix} className="font-mono text-xs whitespace-pre-wrap">
        {tableLines.join("\n")}
      </div>
    );
  }

  const parseRow = (line: string) =>
    line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((c) => c.trim());

  const headerCells = parseRow(tableLines[0]);
  const hasSeparator = tableLines[1].includes("-");
  const bodyLines = hasSeparator ? tableLines.slice(2) : tableLines.slice(1);

  return (
    <div key={keyPrefix} className="my-3 overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs dark:border-gray-800">
      <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm dark:divide-gray-800">
        <thead className="bg-slate-100/90 font-bold text-slate-900 dark:bg-gray-800/90 dark:text-white">
          <tr>
            {headerCells.map((cell, idx) => (
              <th key={idx} className="px-3 py-2 border-r last:border-r-0 border-slate-200 dark:border-gray-700 whitespace-nowrap">
                {renderInlineMath(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white dark:divide-gray-800/60 dark:bg-gray-900">
          {bodyLines.map((line, rIdx) => {
            const cells = parseRow(line);
            return (
              <tr key={rIdx} className="hover:bg-slate-50/60 dark:hover:bg-gray-800/40 transition-colors">
                {cells.map((cell, cIdx) => (
                  <td key={cIdx} className="px-3 py-2 border-r last:border-r-0 border-slate-100 text-slate-700 dark:border-gray-800/50 dark:text-slate-300">
                    {renderInlineMath(cell)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Enhanced MathText:
 * Synchronously parses and renders LaTeX math ($ and $$) with KaTeX (output: html),
 * Markdown Tables (|...|), Code Blocks (```), and sub-question layouts.
 */
export const MathText: React.FC<MathTextProps> = ({ text, className = "" }) => {
  const renderedContent = useMemo(() => {
    if (!text) return null;

    const normalizedText = convertHtmlTableToMarkdown(text).replace(/\n{3,}/g, "\n\n");
    const lines = normalizedText.split("\n");
    const blocks: React.ReactNode[] = [];

    let inCode = false;
    let codeLang = "";
    let codeLines: string[] = [];
    let tableLines: string[] = [];
    let textLines: string[] = [];

    const flushText = (blockIdx: number) => {
      if (textLines.length === 0) return;
      const joined = textLines.join("\n");
      if (joined.trim() === "OR" || joined.trim() === "[OR]" || joined.trim() === "**[OR]**") {
        blocks.push(
          <div key={`or-${blockIdx}`} className="my-2.5 flex items-center gap-2">
            <div className="h-px flex-1 bg-slate-200 dark:bg-gray-800" />
            <span className="rounded-md bg-amber-100 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              OR
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-gray-800" />
          </div>
        );
      } else {
        blocks.push(
          <div key={`txt-${blockIdx}`} className="leading-relaxed">
            {renderInlineMath(joined)}
          </div>
        );
      }
      textLines = [];
    };

    const flushTable = (blockIdx: number) => {
      if (tableLines.length === 0) return;
      blocks.push(parseMarkdownTable(tableLines, blockIdx));
      tableLines = [];
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed.startsWith("```")) {
        if (!inCode) {
          flushText(i);
          flushTable(i);
          inCode = true;
          codeLang = trimmed.slice(3).trim();
          codeLines = [];
        } else {
          inCode = false;
          blocks.push(
            <div key={`code-${i}`} className="my-2.5 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-xs sm:text-sm font-mono text-emerald-400">
              {codeLang && (
                <div className="border-b border-slate-800 bg-slate-900/90 px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {codeLang}
                </div>
              )}
              <pre className="p-3.5 overflow-x-auto leading-relaxed">
                <code>{codeLines.join("\n")}</code>
              </pre>
            </div>
          );
          codeLines = [];
        }
        continue;
      }

      if (inCode) {
        codeLines.push(line);
        continue;
      }

      const isTableLine = (trimmed.startsWith("|") && trimmed.endsWith("|")) || (trimmed.includes("|") && trimmed.split("|").length >= 3);
      if (isTableLine) {
        flushText(i);
        tableLines.push(trimmed);
      } else {
        flushTable(i);
        textLines.push(line);
      }
    }

    if (inCode && codeLines.length > 0) {
      blocks.push(
        <pre key="code-unclosed" className="my-2 p-3 rounded-xl bg-slate-950 text-xs font-mono text-emerald-400 overflow-x-auto">
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
    }
    flushTable(lines.length);
    flushText(lines.length);

    return blocks;
  }, [text]);

  return <div className={`max-w-full overflow-x-auto ${className}`}>{renderedContent}</div>;
};
