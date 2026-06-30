import * as fs from "fs";
import * as path from "path";

const POSTS_DIR = path.resolve(process.cwd(), "content/blog");

interface AltIssue {
  file: string;
  line: number;
  type: "empty" | "generic";
  alt: string;
  src: string;
}

function auditAltText(): AltIssue[] {
  const issues: AltIssue[] = [];

  if (!fs.existsSync(POSTS_DIR)) {
    console.log("No content/blog directory found.");
    return issues;
  }

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    const imageRegex = /!\[(.*?)\]\(([^)]+)\)/g;
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      const alt = match[1].trim();
      const src = match[2].trim();
      const lineNumber = content.substring(0, match.index).split("\n").length;

      if (!alt) {
        issues.push({ file, line: lineNumber, type: "empty", alt, src });
      } else if (/^(image|img|photo|picture)$/i.test(alt)) {
        issues.push({ file, line: lineNumber, type: "generic", alt, src });
      }
    }
  }

  return issues;
}

function main() {
  const issues = auditAltText();

  if (issues.length === 0) {
    console.log("No empty or generic alt text found.");
    return;
  }

  console.log(`Found ${issues.length} image alt text issue(s):\n`);
  for (const issue of issues) {
    console.log(
      `${issue.file}:${issue.line} — ${issue.type === "empty" ? "empty alt" : "generic alt"} "${issue.alt}"`
    );
    console.log(`  src: ${issue.src}\n`);
  }
}

main();
