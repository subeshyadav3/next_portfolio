"use client";

import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathTextProps {
  text: string;
  className?: string;
}

const isOrLine = (line: string) =>
  /^#{0,4}\s*\[?\*{0,2}\s*OR\s*\*{0,2}\]?$/i.test(line.trim());

/**
 * Normalize math syntax quirks so KaTeX renders cleanly without broken control sequences.
 */
function normalizeMathExpression(raw: string): string {
  return raw
    .trim()
    .replace(/µ/g, "\\mu ")
    .replace(/&nbsp;/g, "\\ ")
    .replace(/\\text\{\s*\\mu\s*\\text\{([^}]+)\}\s*\}/g, "\\mu\\text{$1}")
    .replace(/\\text\{\s*\\mu\s+([^}]+)\s*\}/g, "\\,\\mu\\text{$1}")
    .replace(/\\text\{\s*\\Omega\s*\}/g, "\\,\\Omega");
}

function renderKatexSpan(math: string, displayMode: boolean, key: React.Key): React.ReactNode {
  const normalized = normalizeMathExpression(math);
  if (!normalized) return null;

  try {
    const html = katex.renderToString(normalized, {
      displayMode,
      throwOnError: false,
      strict: false,
      output: "html",
    });

    if (displayMode) {
      return (
        <span
          key={key}
          className="my-2.5 block max-w-full overflow-x-auto rounded-xl bg-slate-50/70 px-3 py-2 text-center dark:bg-gray-950/50"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    return (
      <span
        key={key}
        className="inline-math inline px-0.5 [&_.katex]:text-[0.98em]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return (
      <span key={key} className="font-mono text-xs text-slate-600 dark:text-slate-400">
        {displayMode ? `$$${math}$$` : `$${math}$`}
      </span>
    );
  }
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/(?:&nbsp;){2,}/g, "   ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#124;/g, "|")
    .replace(/\\\$/g, "$");
}

/**
 * Renders plain prose segments with inline markdown (**bold**, `code`) and decoded entities.
 */
function renderPlainProse(text: string, keyPrefix: string): React.ReactNode[] {
  const decoded = decodeHtmlEntities(text);
  const mdRegex = /(\*\*[^*\n]+?\*\*|`[^`\n]+?`)/g;
  const segments = decoded.split(mdRegex);

  return segments.map((seg, i) => {
    const key = `${keyPrefix}-md-${i}`;
    if (seg.startsWith("**") && seg.endsWith("**") && seg.length > 4) {
      return (
        <strong key={key} className="font-semibold text-slate-900 dark:text-white">
          {seg.slice(2, -2)}
        </strong>
      );
    }
    if (seg.startsWith("`") && seg.endsWith("`") && seg.length > 2) {
      return (
        <code
          key={key}
          className="rounded-md border border-slate-200/80 bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-slate-800 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200"
        >
          {seg.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={key}>{seg}</React.Fragment>;
  });
}

function renderInlineMath(text: string, keyPrefix = "m"): React.ReactNode[] {
  if (!text) return [];
  // Match $$...$$ or unescaped $...$ (ignoring escaped \$)
  const regex = /(\$\$[\s\S]*?\$\$|(?<!\\)\$(?!\$)(?:\\.|[^$\n])+?(?<!\\)\$)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith("$$") && part.endsWith("$$") && part.length > 4) {
      return renderKatexSpan(part.slice(2, -2), true, key);
    }
    if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
      return renderKatexSpan(part.slice(1, -1), false, key);
    }
    return <React.Fragment key={key}>{renderPlainProse(part, key)}</React.Fragment>;
  });
}

/**
 * Renders a single line of question text, formatting trailing marks like [4+4] cleanly
 * and applying subtle indentation/weight to sub-question labels like (a), b), (i).
 */
function renderQuestionLine(line: string, lineKey: string): React.ReactNode {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // Check for trailing marks annotation like [8] or [4+4] or [2+2+4]
  let body = line;
  let marksLabel: string | null = null;
  const marksMatch = line.match(/^(.*?)\s+\[(\d+(?:\s*[+×x*]\s*\d+)*)\]\s*$/);
  if (marksMatch && marksMatch[1].trim().length > 0) {
    body = marksMatch[1];
    marksLabel = marksMatch[2];
  }

  // Detect sub-question prefix like "(a) ", "a) ", "(i) ", "i) ", "(1) "
  const subMatch = body.match(/^(\s*(?:\([a-z0-9]{1,3}\)|[a-z]\)|[ivx]{1,4}\))\s+)(.*)$/i);

  return (
    <div key={lineKey} className="leading-relaxed">
      {subMatch ? (
        <>
          <span className="font-semibold text-slate-900 dark:text-white">
            {subMatch[1].trimStart()}
          </span>
          <span>{renderInlineMath(subMatch[2], `${lineKey}-s`)}</span>
        </>
      ) : (
        <span>{renderInlineMath(body, lineKey)}</span>
      )}
      {marksLabel && (
        <span className="ml-2 inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 align-middle font-mono text-[11px] font-semibold text-slate-600 dark:bg-gray-800 dark:text-slate-300">
          [{marksLabel}]
        </span>
      )}
    </div>
  );
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
      <div key={`tbl-raw-${keyPrefix}`} className="font-mono text-xs whitespace-pre-wrap">
        {tableLines.join("\n")}
      </div>
    );
  }

  const parseRow = (line: string) => {
    const trimmed = line.trim().replace(/^\||\|$/g, "");
    const cells: string[] = [];
    let current = "";
    let inMath = false;
    for (let i = 0; i < trimmed.length; i++) {
      const ch = trimmed[i];
      if (ch === "$" && trimmed[i - 1] !== "\\") {
        inMath = !inMath;
        current += ch;
      } else if (ch === "|" && !inMath) {
        cells.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    cells.push(current.trim());
    return cells;
  };

  const headerCells = parseRow(tableLines[0]);
  const hasSeparator = tableLines[1].includes("---");
  const bodyLines = hasSeparator ? tableLines.slice(2) : tableLines.slice(1);

  return (
    <div
      key={`tbl-${keyPrefix}`}
      className="my-3 overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs dark:border-gray-800"
    >
      <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm dark:divide-gray-800">
        <thead className="bg-slate-100/90 font-bold text-slate-900 dark:bg-gray-800/90 dark:text-white">
          <tr>
            {headerCells.map((cell, idx) => (
              <th
                key={idx}
                className="border-r border-slate-200 px-3 py-2 whitespace-nowrap last:border-r-0 dark:border-gray-700"
              >
                {renderInlineMath(cell, `th-${keyPrefix}-${idx}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white dark:divide-gray-800/60 dark:bg-gray-900">
          {bodyLines.map((line, rIdx) => {
            const cells = parseRow(line);
            return (
              <tr key={rIdx} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-gray-800/40">
                {cells.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className="border-r border-slate-100 px-3 py-2 text-slate-700 last:border-r-0 dark:border-gray-800/50 dark:text-slate-300"
                  >
                    {renderInlineMath(cell, `td-${keyPrefix}-${rIdx}-${cIdx}`)}
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
 * Parses multi-line display math ($$...$$), inline math ($...$),
 * code blocks (```), Markdown/HTML tables, inline markdown, OR separators,
 * and sub-question lines with KaTeX rendering.
 */
export const MathText: React.FC<MathTextProps> = ({ text, className = "" }) => {
  const renderedContent = useMemo(() => {
    if (!text) return null;

    const normalizedText = convertHtmlTableToMarkdown(text)
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n");

    const blocks: React.ReactNode[] = [];
    // First split out fenced code blocks and multi-line $$...$$ display math blocks
    const topLevelRegex = /(```[\s\S]*?```|\$\$[\s\S]*?\$\$)/g;
    const segments = normalizedText.split(topLevelRegex);

    let blockCounter = 0;

    for (let sIdx = 0; sIdx < segments.length; sIdx++) {
      const seg = segments[sIdx];
      if (!seg) continue;

      if (seg.startsWith("```") && seg.endsWith("```") && seg.length >= 6) {
        const inner = seg.slice(3, -3);
        const firstNewline = inner.indexOf("\n");
        const codeLang = firstNewline !== -1 ? inner.slice(0, firstNewline).trim() : "";
        const codeBody = firstNewline !== -1 ? inner.slice(firstNewline + 1) : inner;

        blocks.push(
          <div
            key={`code-${blockCounter++}`}
            className="my-2.5 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs text-emerald-400 sm:text-sm"
          >
            {codeLang && (
              <div className="border-b border-slate-800 bg-slate-900/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {codeLang}
              </div>
            )}
            <pre className="overflow-x-auto p-3.5 leading-relaxed">
              <code>{codeBody.replace(/^\n+|\n+$/g, "")}</code>
            </pre>
          </div>
        );
        continue;
      }

      if (seg.startsWith("$$") && seg.endsWith("$$") && seg.length > 4) {
        const mathBody = seg.slice(2, -2);
        blocks.push(renderKatexSpan(mathBody, true, `dmath-${blockCounter++}`));
        continue;
      }

      // Parse line-by-line within prose segments for tables, OR separators, and sub-questions
      const lines = seg.split("\n");
      let tableLines: string[] = [];
      let textLines: string[] = [];

      const pushOr = (idx: number) => {
        blocks.push(
          <div key={`or-${sIdx}-${idx}`} className="my-2.5 flex items-center gap-2">
            <div className="h-px flex-1 bg-slate-200 dark:bg-gray-800" />
            <span className="rounded-md bg-amber-100 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              OR
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-gray-800" />
          </div>
        );
      };

      const flushTable = (idx: number) => {
        if (tableLines.length === 0) return;
        blocks.push(parseMarkdownTable(tableLines, sIdx * 1000 + idx));
        tableLines = [];
      };

      const flushText = (idx: number) => {
        if (textLines.length === 0) return;
        const joined = textLines.join("\n").trim();
        textLines = [];
        if (!joined) return;

        if (isOrLine(joined)) {
          pushOr(idx);
          return;
        }

        const subLines = joined.split("\n");
        const lineNodes = subLines
          .map((subLine, lIdx) => {
            if (!subLine.trim()) {
              return <div key={`gap-${sIdx}-${idx}-${lIdx}`} className="h-1.5" />;
            }
            return renderQuestionLine(subLine, `ln-${sIdx}-${idx}-${lIdx}`);
          })
          .filter(Boolean);

        if (lineNodes.length > 0) {
          blocks.push(
            <div key={`txt-${sIdx}-${idx}`} className="space-y-1.5">
              {lineNodes}
            </div>
          );
        }
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        const isTableLine =
          trimmed.startsWith("|") &&
          trimmed.endsWith("|") &&
          trimmed.length > 2 &&
          !trimmed.startsWith("|$");

        if (isTableLine) {
          flushText(i);
          tableLines.push(trimmed);
        } else if (isOrLine(trimmed)) {
          flushText(i);
          flushTable(i);
          pushOr(i);
        } else {
          flushTable(i);
          textLines.push(line);
        }
      }

      flushTable(lines.length);
      flushText(lines.length);
    }

    return blocks;
  }, [text]);

  return <div className={`min-w-0 max-w-full space-y-2 overflow-x-auto break-words ${className}`}>{renderedContent}</div>;
};
