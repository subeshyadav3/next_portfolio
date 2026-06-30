import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import matter from "gray-matter";

const DIR = path.join(process.cwd(), "content/blog");

// Build rename map: new name → old name in 27c2ab3
const out = execSync(
  'git diff 27c2ab3..3d9170a --diff-filter=R --name-status',
  { encoding: "utf-8" }
);
const rename = {};
for (const line of out.trim().split("\n").filter(Boolean)) {
  const [ , oldP, newP ] = line.split("\t");
  rename[path.basename(newP)] = oldP;
}

const files = fs.readdirSync(DIR).filter(f => f.endsWith(".mdx") || f.endsWith(".md"));
let ok = 0, skip = 0;

for (const file of files) {
  const fp = path.join(DIR, file);

  // Try to get original from git
  let gitRef = `content/blog/${file}`;
  if (rename[file]) gitRef = rename[file];

  let origRaw;
  try {
    origRaw = execSync(`git show 27c2ab3:"${gitRef}"`, { encoding: "utf-8" });
  } catch {
    console.log(`  SKIP (new file): ${file}`);
    skip++;
    continue;
  }

  // Parse frontmatter from current, body from original using gray-matter
  const orig = matter(origRaw);
  const curr = matter(fs.readFileSync(fp, "utf-8"));

  // Merge: current frontmatter data + original body
  const merged = matter.stringify(orig.content, { ...curr.data });

  // Remove oldUrl from frontmatter
  const cleaned = merged.replace(/^oldUrl:.*\n?/gm, "");

  fs.writeFileSync(fp, cleaned, "utf-8");
  console.log(`  OK: ${file}`);
  ok++;
}

console.log(`\nDone: ${ok} restored, ${skip} skipped (new files)`);
