import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { mdxComponents } from "@/components/blog/mdx-components";
import { TocItem } from "./types";
import { slugifyText } from "./slugs";

/* -------------------------------------------------------------------------- */
/*  Sanitize schema — allow the tags we need for educational MDX              */
/* -------------------------------------------------------------------------- */

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    "*": [...(defaultSchema.attributes?.["*"] ?? []), "className", "class", "id"],
    code: [...(defaultSchema.attributes?.code ?? []), "className"],
    span: [...(defaultSchema.attributes?.span ?? []), "className", "style"],
    div: [...(defaultSchema.attributes?.div ?? []), "className"],
    pre: [...(defaultSchema.attributes?.pre ?? []), "className"],
    h1: [...(defaultSchema.attributes?.h1 ?? []), "id"],
    h2: [...(defaultSchema.attributes?.h2 ?? []), "id"],
    h3: [...(defaultSchema.attributes?.h3 ?? []), "id"],
    h4: [...(defaultSchema.attributes?.h4 ?? []), "id"],
    h5: [...(defaultSchema.attributes?.h5 ?? []), "id"],
    h6: [...(defaultSchema.attributes?.h6 ?? []), "id"],
    math: [["xmlns"]],
    annotation: [["encoding"]],
    semantics: [],
    mrow: [],
    mi: [],
    mo: [],
    mn: [],
    msup: [],
    msub: [],
    mfrac: [],
    msqrt: [],
    mtable: [],
    mtr: [],
    mtd: [],
    mtext: [],
    mspace: [],
  },
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    "math",
    "annotation",
    "semantics",
    "mrow",
    "mi",
    "mo",
    "mn",
    "msup",
    "msub",
    "mfrac",
    "msqrt",
    "mtable",
    "mtr",
    "mtd",
    "mtext",
    "mspace",
  ],
};

/* -------------------------------------------------------------------------- */
/*  Compile MDX source → React tree                                           */
/* -------------------------------------------------------------------------- */

export async function compilePostMdx(
  source: string,
  category: string
): Promise<React.ReactNode> {
  // Pre-process the source: legacy MDX/markdown mixes HTML and MDX.
  // MDX requires self-closing tags like <br />, but many existing posts
  // use HTML <br>. Normalize them so MDX can parse without choking.
  const normalized = normalizeLegacyHtml(source);

  return (
    <MDXRemote
      source={normalized}
      components={mdxComponents(category)}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkDirective, remarkMath],
          rehypePlugins: [
            [
              rehypeRaw,
              {
                // Allow MDX-specific nodes to pass through unprocessed
                passThrough: [
                  "mdxJsxFlowElement",
                  "mdxJsxTextElement",
                  "mdxFlowExpression",
                  "mdxTextExpression",
                  "mdxjsEsm",
                ],
              },
            ],
            rehypeSlug,
            [
              rehypeAutolinkHeadings,
              { behavior: "append", properties: { className: ["heading-anchor"] } },
            ],
            rehypeKatex,
            [
              rehypeExternalLinks,
              { target: "_blank", rel: ["noopener", "noreferrer", "nofollow"] },
            ],
            [rehypeSanitize, sanitizeSchema],
          ],
        },
        parseFrontmatter: false,
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Source normalization — handle legacy HTML in MDX                         */
/* -------------------------------------------------------------------------- */

/**
 * Tags that must be self-closed in MDX (and JSX). Convert <br> → <br />,
 * <hr> → <hr />, <img ...> → <img ... />. The trailing `>` becomes ` />`
 * unless it's already self-closed.
 */
const SELF_CLOSING_TAGS = new Set([
  "br",
  "hr",
  "img",
  "input",
  "meta",
  "link",
  "source",
  "track",
  "wbr",
  "col",
  "area",
  "base",
  "embed",
  "param",
]);

function normalizeLegacyHtml(src: string): string {
  // 1. <tag> → <tag /> for self-closing tags (only when not already closed)
  const out = src.replace(
    /<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^<>]*?)(\/?)>/g,
    (match, closing, tag, attrs, selfClose) => {
      const lower = tag.toLowerCase();
      if (closing) return match; // already a closing tag like </p>
      if (selfClose) return match; // already self-closing
      if (SELF_CLOSING_TAGS.has(lower)) {
        // Strip a trailing space if any, then add ` />`
        const trimmed = match.replace(/>\s*$/, "");
        return `${trimmed} />`;
      }
      return match;
    }
  );
  // 2. Some posts have inline `</p>` issues or stray <font> tags. The
  //    sanitizer handles <font> at the rehype layer.
  return out;
}

/* -------------------------------------------------------------------------- */
/*  Headings / TOC                                                            */
/* -------------------------------------------------------------------------- */

export function slugifyHeading(text: string): string {
  return slugifyText(
    text
      .replace(/\*\*/g, "")
      .replace(/__/g, "")
      .trim()
  );
}

export function extractTableOfContents(content: string): TocItem[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/\*\*/g, "").replace(/__/g, "").trim();
    const id = slugifyHeading(text);
    items.push({ id, text, level });
  }

  return items;
}
