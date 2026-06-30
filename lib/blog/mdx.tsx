import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { TocItem } from "./types";

export async function compilePostMdx(source: string): Promise<React.ReactNode> {
  const html = await marked(source, {
    gfm: true,
    breaks: false,
  });

  const sanitized = sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "br",
      "hr",
      "div",
      "span",
      "table",
      "thead",
      "tbody",
      "tr",
      "td",
      "th",
      "caption",
      "colgroup",
      "col",
      "figure",
      "figcaption",
      "strong",
      "em",
      "b",
      "i",
      "u",
      "s",
      "strike",
      "blockquote",
      "pre",
      "code",
      "ul",
      "ol",
      "li",
      "dl",
      "dt",
      "dd",
      "a",
      "p",
      "sub",
      "sup",
      "center",
      "font",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height", "loading", "class"],
      a: ["href", "title", "target", "rel", "class"],
      div: ["id", "class"],
      span: ["id", "class", "style", "lang"],
      table: ["class", "border", "cellpadding", "cellspacing", "width"],
      td: ["colspan", "rowspan", "width", "valign", "style"],
      th: ["colspan", "rowspan", "width", "valign", "style"],
      pre: ["class"],
      code: ["class"],
      h1: ["id", "class"],
      h2: ["id", "class"],
      h3: ["id", "class"],
      h4: ["id", "class"],
      h5: ["id", "class"],
      h6: ["id", "class"],
      p: ["class", "style", "align"],
      font: ["size", "color", "face"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      h1: "h2",
    },
  });

  return (
    <div
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

export function extractTableOfContents(content: string): TocItem[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/\*\*/g, "").replace(/__/g, "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    items.push({ id, text, level });
  }

  return items;
}
