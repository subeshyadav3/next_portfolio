import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "content/blog");
const files = fs.readdirSync(dir).filter(f => f.endsWith(".mdx") || f.endsWith(".md"));

let count = 0;
for (const file of files) {
  const fp = path.join(dir, file);
  let content = fs.readFileSync(fp, "utf-8");
  const result = content.replace(/^oldUrl:.*\n?/gm, "");
  if (result !== content) {
    fs.writeFileSync(fp, result, "utf-8");
    count++;
    console.log(`  ${file}`);
  }
}
console.log(`\nRemoved oldUrl from ${count} files`);
