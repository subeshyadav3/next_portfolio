import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "content/blog");
const files = fs.readdirSync(dir).filter(f => f.endsWith(".mdx") || f.endsWith(".md"));

let fixed = 0;

for (const file of files) {
  const fp = path.join(dir, file);
  let content = fs.readFileSync(fp, "utf-8");
  let original = content;

  // Fix 1: Blogger-style clickable images with blank lines inside link syntax
  // [\n\n![](img)\n\n](url) → [![](img)](url)
  content = content.replace(
    /\[\s*\n+\s*!\[([^\]]*)\]\(([^)]+)\)\s*\n+\s*\]\(([^)]+)\)/g,
    (match, alt, imgUrl, fullUrl) => `[![${alt}](${imgUrl})](${fullUrl})`
  );

  // Fix 2: Plain [](url) without ! → ![](url) (broken image link)
  content = content.replace(
    /(?<!!)\[\s*\]\((https?:\/\/[^)]+)\)/g,
    (match, url) => `![](${url})`
  );

  if (content !== original) {
    fs.writeFileSync(fp, content, "utf-8");
    fixed++;
    console.log(`  ${file}`);
  }
}

console.log(`\nFixed images in ${fixed} files`);
