import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.resolve(process.cwd(), "content/blog");
const WORD_COUNT_FLOOR = 100;

interface ThinPost {
  file: string;
  slug: string;
  title: string;
  wordCount: number;
}

function countWords(text: string): number {
  // Count Devanagari word runs and Latin word runs separately.
  const devanagariWords = text.match(/[\u0900-\u097F]+/g) || [];
  const latinText = text.replace(/[\u0900-\u097F]/g, " ");
  const latinWords = latinText.match(/\b\w+\b/g) || [];
  return devanagariWords.length + latinWords.length;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function auditThinContent(): ThinPost[] {
  const thinPosts: ThinPost[] = [];

  if (!fs.existsSync(POSTS_DIR)) {
    console.log("No content/blog directory found.");
    return thinPosts;
  }

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    const text = stripHtml(content);
    const wordCount = countWords(text);

    if (wordCount < WORD_COUNT_FLOOR) {
      thinPosts.push({
        file,
        slug: data.slug || file.replace(/\.mdx?$/, ""),
        title: data.title || "Untitled",
        wordCount,
      });
    }
  }

  return thinPosts.sort((a, b) => a.wordCount - b.wordCount);
}

function main() {
  const thinPosts = auditThinContent();

  if (thinPosts.length === 0) {
    console.log(`All posts are above ${WORD_COUNT_FLOOR} words.`);
    return;
  }

  console.log(
    `Found ${thinPosts.length} post(s) under ${WORD_COUNT_FLOOR} words:\n`
  );
  for (const post of thinPosts) {
    console.log(
      `${post.file} — "${post.title}" (${post.wordCount} words)`
    );
  }

  console.log(
    "\nDecision required for each: expand content, add noindex, or leave as-is."
  );
}

main();
