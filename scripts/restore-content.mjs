import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const POSTS_DIR = path.join(process.cwd(), "content/blog");

// Get all current files
const currentFiles = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".mdx") || f.endsWith(".md"));

// Get git diff to find renames
const renameOutput = execSync(
  'git diff 27c2ab3..3d9170a --diff-filter=R --name-status',
  { cwd: process.cwd(), encoding: "utf-8" }
);
const renameMap = new Map();
renameOutput.trim().split("\n").filter(Boolean).forEach(line => {
  const parts = line.split("\t");
  if (parts.length === 3) {
    renameMap.set(parts[2], parts[1]); // new → old
  }
});

// Get files that were removed in the commit (deleted)
const deleteOutput = execSync(
  'git diff 27c2ab3..3d9170a --diff-filter=D --name-only',
  { cwd: process.cwd(), encoding: "utf-8" }
);
const deletedFiles = deleteOutput.trim().split("\n").filter(Boolean);

console.log(`Found ${currentFiles.length} current files, ${renameMap.size} renames, ${deletedFiles.length} deletions`);

// For each current file, merge frontmatter from current with body from original
for (const file of currentFiles) {
  const currentPath = path.join(POSTS_DIR, file);
  const oldName = renameMap.get(`content/blog/${file}`);
  
  let originalContent;
  if (oldName) {
    // File was renamed - get original content from old name
    try {
      originalContent = execSync(
        `git show 27c2ab3:"${oldName}"`,
        { cwd: process.cwd(), encoding: "utf-8" }
      );
    } catch {
      console.log(`  SKIP (old file not found): ${file}`);
      continue;
    }
  } else {
    // File was not renamed - get original content
    try {
      originalContent = execSync(
        `git show 27c2ab3:"content/blog/${file}"`,
        { cwd: process.cwd(), encoding: "utf-8" }
      );
    } catch {
      console.log(`  SKIP (new file): ${file}`);
      continue;
    }
  }

  // Read current content (has updated frontmatter)
  const currentContent = fs.readFileSync(currentPath, "utf-8");

  // Split frontmatter and body for both
  const currentParts = currentContent.split("---");
  const originalParts = originalContent.split("---");

  if (currentParts.length < 3 || originalParts.length < 3) {
    console.log(`  SKIP (parse error): ${file}`);
    continue;
  }

  // Keep frontmatter from current, body from original
  // Note: currentParts[0] is empty (before first ---)
  // currentParts[1] is frontmatter
  // currentParts[2...] is body (rejoin with ---)
  const currentFrontmatter = currentParts[1];
  const originalBody = originalParts.slice(2).join("---");

  // Merge
  const merged = `---${currentFrontmatter}---${originalBody}`;

  // Write back
  fs.writeFileSync(currentPath, merged, "utf-8");
  console.log(`  RESTORED: ${file}${oldName ? ` (was ${oldName})` : ""}`);
}

console.log("\nDone! Body content restored for all files.");
