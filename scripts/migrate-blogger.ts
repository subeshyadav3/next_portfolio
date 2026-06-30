import { XMLParser } from "fast-xml-parser";
import TurndownService from "turndown";
import sanitizeHtml from "sanitize-html";
import slugify from "slugify";
import * as fs from "fs";
import * as path from "path";

const BLOG_FEED_URL =
  "https://nepaliessaybook.blogspot.com/feeds/posts/default?max-results=500";
const OUT_DIR = path.resolve(process.cwd(), "content/blog");
const DATA_DIR = path.resolve(process.cwd(), "data");
const IMAGE_DIR = path.resolve(process.cwd(), "public/images/blog");

// Ensure output directories exist
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(IMAGE_DIR, { recursive: true });

interface FeedEntry {
  id: string;
  title?: string | { "#text": string };
  published?: string;
  updated?: string;
  category?: Array<{ "@_term": string }> | { "@_term": string };
  content?: string | { "#text": string; "@_type": string };
  link?: Array<{ "@_rel": string; "@_href": string } | { "@_href": string }>;
  author?: { name?: string; uri?: string; email?: string };
  "media:thumbnail"?: { "@_url": string };
  "thr:total"?: number | string;
}

interface FeedData {
  feed: {
    title?: string;
    entry?: FeedEntry[] | FeedEntry;
    link?: Array<{ "@_rel": string; "@_href": string }>;
    "openSearch:totalResults"?: number | string;
    updated?: string;
  };
}

interface PostMeta {
  slug: string;
  title: string;
  description: string;
  published: string;
  updated: string;
  category: string;
  tags: string[];
  author: string;
  authorUrl: string;
  oldUrl: string;
  image: string;
  readingTime: number;
  featured: boolean;
}

function getText(val: string | { "#text": string } | undefined): string {
  if (!val) return "";
  if (typeof val === "string") return val.trim();
  return (val["#text"] ?? "").trim();
}

function getHtml(val: string | { "#text": string } | undefined): string {
  return getText(val);
}

function getCategories(entry: FeedEntry): string[] {
  const cats = entry.category;
  if (!cats) return [];
  if (Array.isArray(cats)) {
    return cats.map((c) => c["@_term"]).filter(Boolean);
  }
  return [cats["@_term"]].filter(Boolean);
}

function getOldUrl(entry: FeedEntry): string {
  if (!entry.link) return "";
  const links = Array.isArray(entry.link) ? entry.link : [entry.link];
  const alternate = links.find(
    (l) => "@_rel" in l && l["@_rel"] === "alternate" && "@_href" in l
  );
  return alternate && "@_href" in alternate ? alternate["@_href"] : "";
}

function extractBloggerSlug(oldUrl: string): string {
  if (!oldUrl) return "";
  try {
    const pathname = new URL(oldUrl).pathname;
    const match = pathname.match(/\/(\d{4})\/(\d{2})\/(.+?)\.html$/);
    if (match) return match[3];
  } catch {
    // ignore
  }
  return "";
}

function cleanTitle(title: string): string {
  return title
    .replace(/\s+/g, " ")
    .replace(/[|]/g, "-")
    .trim();
}

function generateSlug(title: string, oldUrl: string, usedSlugs: Set<string>): string {
  let base = "";
  const bloggerSlug = extractBloggerSlug(oldUrl);
  const cleanedTitle = cleanTitle(title);

  // Prefer title-based slug for English titles; fallback to Blogger slug
  const isDevanagari = /[\u0900-\u097F]/.test(cleanedTitle);
  if (!isDevanagari && cleanedTitle) {
    base = slugify(cleanedTitle, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
  } else if (bloggerSlug) {
    base = bloggerSlug;
  } else {
    base = slugify(cleanedTitle, { lower: true, strict: true }) || "post";
  }

  // Truncate overly long slugs
  base = base.replace(/^-+|-+$/g, "");
  if (base.length > 80) base = base.slice(0, 80).replace(/-+$/, "");

  let slug = base;
  let counter = 2;
  while (usedSlugs.has(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }
  usedSlugs.add(slug);
  return slug;
}

function decodeHtmlEntities(html: string): string {
  const entities: Record<string, string> = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&ndash;": "–",
    "&mdash;": "—",
    "&lsquo;": "'",
    "&rsquo;": "'",
    "&ldquo;": '"',
    "&rdquo;": '"',
    "&hellip;": "…",
  };
  return html.replace(/&[a-zA-Z0-9#]+;/g, (entity) => entities[entity] || entity);
}

function stripHtml(html: string): string {
  const decoded = decodeHtmlEntities(html);
  return decoded
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function generateDescription(html: string, title: string): string {
  const text = stripHtml(html);
  if (!text) return title;
  // Skip leading non-breaking spaces and find first meaningful sentence
  const cleaned = text.replace(/^[\s\u00A0]+/, "");
  const firstSentence = cleaned.split(/[।.!?]/)?.[0]?.trim() || cleaned;
  const desc = firstSentence.slice(0, 155).trim();
  return desc.length < cleaned.length && desc.length >= 150 ? `${desc}...` : desc;
}

function countWords(text: string): number {
  // Nepali and English mixed word counting
  const devanagariWords = text.match(/[\u0900-\u097F]+/g) || [];
  const latinWords = text.replace(/[\u0900-\u097F]/g, "").match(/\b\w+\b/g) || [];
  return devanagariWords.length + latinWords.length;
}

function calculateReadingTime(html: string): number {
  const text = stripHtml(html);
  const words = countWords(text);
  // Average reading speed ~200 wpm; Nepali content may be slower, use 150
  return Math.max(1, Math.ceil(words / 150));
}

function sanitizeBloggerHtml(html: string): string {
  return sanitizeHtml(html, {
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
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height", "loading"],
      a: ["href", "title", "target", "rel"],
      div: ["id", "class"],
      span: ["id", "class"],
      table: ["class"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan"],
      pre: ["class"],
      code: ["class"],
      h1: ["id"],
      h2: ["id"],
      h3: ["id"],
      h4: ["id"],
      h5: ["id"],
      h6: ["id"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      h1: "h2",
    },
    exclusiveFilter: (frame) => {
      // Remove empty divs/spans often used for Blogger layout
      if (frame.tag === "div" || frame.tag === "span") {
        const text = stripHtml(frame.text);
        if (!text && !frame.attribs.class && !frame.attribs.id) return true;
      }
      return false;
    },
  });
}

function htmlToMarkdown(html: string): string {
  const turndown = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
  });

  turndown.addRule("bloggerImages", {
    filter: "img",
    replacement: (content, node) => {
      const src = (node as HTMLImageElement).getAttribute("src") || "";
      const alt = (node as HTMLImageElement).getAttribute("alt") || "";
      const title = (node as HTMLImageElement).getAttribute("title") || "";
      if (!src) return "";
      return `\n\n![${alt || title || ""}](${src})\n\n`;
    },
  });

  turndown.addRule("bloggerLinks", {
    filter: "a",
    replacement: (content, node) => {
      const href = (node as HTMLAnchorElement).getAttribute("href") || "";
      const title = (node as HTMLAnchorElement).getAttribute("title") || "";
      if (!href) return content;
      return `[${content}](${href}${title ? ` "${title}"` : ""})`;
    },
  });

  // Keep tables and other complex structures as raw HTML inside MDX
  turndown.keep(["table", "thead", "tbody", "tr", "td", "th", "caption", "figure", "figcaption"]);

  return turndown.turndown(html);
}

function normalizeTags(categories: string[]): { category: string; tags: string[] } {
  if (categories.length === 0) return { category: "General", tags: [] };

  // Normalize known categories
  const knownCategories = [
    "Nepali Essay/Nibandha",
    "Nepali Poems/Kabita",
    "Nepali Story/Katha",
    "Nepali Shayari",
    "Gajal",
    "Book Review",
    "SEE PRACTICE BOOK",
    "BLE PRACTICE 2076",
    "Class 10",
    "Class 11",
    "Class 8",
    "class 7",
    "CLASS 9",
    "Digital Marketing",
    "Technology",
    "Programming",
    "General Knowledge",
  ];

  const normalizedKnown = knownCategories.map((c) => c.toLowerCase());
  const firstCategoryIndex = categories.findIndex((c) =>
    normalizedKnown.includes(c.toLowerCase())
  );

  const primary =
    firstCategoryIndex >= 0 ? categories[firstCategoryIndex] : categories[0];

  const tags = categories.filter((c, i) => i !== firstCategoryIndex);

  return { category: primary, tags };
}

function generateSeoTitle(title: string, category?: string): string {
  const base = cleanTitle(title);
  if (category && category !== "General") {
    return `${base} | ${category}`;
  }
  return base;
}

async function fetchFeedPage(startIndex: number): Promise<FeedData> {
  const url = `${BLOG_FEED_URL}&start-index=${startIndex}`;
  console.log(`Fetching feed page starting at ${startIndex}...`);
  const res = await fetch(url, {
    headers: {
      Accept: "application/atom+xml",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch feed: ${res.status} ${res.statusText}`);
  }
  const xml = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseAttributeValue: false,
    trimValues: true,
  });
  return parser.parse(xml) as FeedData;
}

async function downloadFeed(): Promise<FeedData> {
  const allEntries: FeedEntry[] = [];
  let startIndex = 1;
  let totalResults = 0;
  let page = 1;

  while (true) {
    const data = await fetchFeedPage(startIndex);
    const entries = data.feed.entry
      ? Array.isArray(data.feed.entry)
        ? data.feed.entry
        : [data.feed.entry]
      : [];

    if (entries.length === 0) break;

    allEntries.push(...entries);

    const pageTotal = Number(data.feed["openSearch:totalResults"] || 0);
    if (pageTotal > totalResults) totalResults = pageTotal;

    console.log(`  Page ${page}: ${entries.length} posts (total: ${allEntries.length}/${totalResults})`);

    if (allEntries.length >= totalResults) break;

    startIndex = allEntries.length + 1;
    page++;
  }

  // Save combined feed for audit
  const combinedXml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Combined feed from ${allEntries.length} posts fetched from Blogger -->
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Essay in Nepali | Nepali Poems | SEE BLE Questions - Backup</title>
  <updated>${new Date().toISOString()}</updated>
  ${allEntries.map((e) => `<entry><id>${e.id}</id><title>${getText(e.title as any)}</title></entry>`).join("\n")}
</feed>`;
  fs.writeFileSync(path.join(DATA_DIR, "blog-feed.xml"), combinedXml, "utf-8");

  return {
    feed: {
      ...allEntries[0],
      entry: allEntries,
      "openSearch:totalResults": totalResults,
      updated: new Date().toISOString(),
    } as any,
  };
}

async function main() {
  const data = await downloadFeed();
  const entries = data.feed.entry
    ? Array.isArray(data.feed.entry)
      ? data.feed.entry
      : [data.feed.entry]
    : [];

  console.log(`\nFound ${entries.length} total posts`);

  const usedSlugs = new Set<string>();
  const redirects: Record<string, string> = {};
  const manifest: PostMeta[] = [];

  for (const entry of entries) {
    const rawTitle = getText(entry.title as any);
    const html = getHtml(entry.content as any);
    const oldUrl = getOldUrl(entry);
    const categories = getCategories(entry);
    const { category, tags } = normalizeTags(categories);

    const title = cleanTitle(rawTitle);
    const slug = generateSlug(title, oldUrl, usedSlugs);
    const description = generateDescription(html, title);
    const seoTitle = generateSeoTitle(title, category);
    const readingTime = calculateReadingTime(html);
    const sanitizedHtml = sanitizeBloggerHtml(html);
    const markdown = htmlToMarkdown(sanitizedHtml);

    const published = entry.published || "";
    const updated = entry.updated || "";
    const authorName = entry.author?.name || "Subesh Yadav";
    const authorUrl = entry.author?.uri || "https://subeshyadav.com.np";
    const image = (entry as any)["media:thumbnail"]?.["@_url"] || "";

    const frontmatter = {
      title: seoTitle,
      description,
      slug,
      published,
      updated,
      category,
      tags,
      author: authorName,
      authorUrl,
      oldUrl,
      image,
      readingTime,
      featured: false,
    };

    const mdxContent = `---\n${Object.entries(frontmatter)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length === 0) {
            return `${key}: []`;
          }
          return `${key}:\n${value.map((v) => `  - ${JSON.stringify(v)}`).join("\n")}`;
        }
        if (typeof value === "string" && value.includes("\n")) {
          return `${key}: |\n  ${value.replace(/\n/g, "\n  ")}`;
        }
        return `${key}: ${JSON.stringify(value)}`;
      })
      .join("\n")}\n---\n\n${markdown}\n`;

    const filePath = path.join(OUT_DIR, `${slug}.mdx`);
    fs.writeFileSync(filePath, mdxContent, "utf-8");

    redirects[oldUrl] = `/blog/${slug}`;
    manifest.push(frontmatter);

    console.log(`✓ ${slug}`);
  }

  fs.writeFileSync(
    path.join(DATA_DIR, "redirects.json"),
    JSON.stringify(redirects, null, 2),
    "utf-8"
  );
  fs.writeFileSync(
    path.join(DATA_DIR, "post-manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf-8"
  );

  console.log("\nMigration complete!");
  console.log(`Posts: ${manifest.length}`);
  console.log(`Output: ${OUT_DIR}`);
  console.log(`Redirects: ${Object.keys(redirects).length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
