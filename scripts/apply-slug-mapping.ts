import * as fs from "fs";
import * as path from "path";

const CSV_PATH = path.resolve(process.cwd(), "data/slug-mapping.csv");
const OUT_DIR = path.resolve(process.cwd(), "content/blog");
const DATA_DIR = path.resolve(process.cwd(), "data");
const BLOGGER_DOMAIN = "https://nepaliessaybook.blogspot.com";

interface MappingRow {
  title: string;
  category: string;
  oldFilename: string;
  oldSlug: string;
  newSlug: string;
  isBadOld: boolean;
  published: string;
}

function parseCsv(content: string): MappingRow[] {
  const lines = content.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows: MappingRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const cells: string[] = [];
    let current = "";
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        cells.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    cells.push(current.trim());

    if (cells.length < 7) continue;

    rows.push({
      title: cells[0],
      category: cells[1],
      oldFilename: cells[2],
      oldSlug: cells[3],
      newSlug: cells[4],
      isBadOld: cells[5].toLowerCase() === "true",
      published: cells[6],
    });
  }

  return rows;
}

function findFileByOldUrl(outDir: string, targetOldUrl: string): string | null {
  if (!fs.existsSync(outDir)) return null;
  for (const file of fs.readdirSync(outDir)) {
    if (!file.endsWith(".mdx")) continue;
    const content = fs.readFileSync(path.join(outDir, file), "utf-8");
    const match = content.match(/^oldUrl:\s*"?([^"\n]+)"?/m);
    if (match?.[1].trim() === targetOldUrl) {
      return file;
    }
  }
  return null;
}

function updateFrontmatterSlug(content: string, newSlug: string): string {
  return content.replace(/^slug:\s*"?[^"\n]+"?/m, `slug: "${newSlug}"`);
}

async function main() {
  const csvContent = fs.readFileSync(CSV_PATH, "utf-8");
  const rows = parseCsv(csvContent);

  console.log(`Loaded ${rows.length} slug mapping rows`);

  const redirects: Record<string, string> = {};
  let renamed = 0;
  let skipped = 0;
  let notFound: string[] = [];

  for (const row of rows) {
    const oldUrl = `${BLOGGER_DOMAIN}${row.oldFilename}`;
    const currentFile = findFileByOldUrl(OUT_DIR, oldUrl);

    if (!currentFile) {
      notFound.push(oldUrl);
      continue;
    }

    const oldFilePath = path.join(OUT_DIR, currentFile);
    const content = fs.readFileSync(oldFilePath, "utf-8");
    const newContent = updateFrontmatterSlug(content, row.newSlug);
    const newFilePath = path.join(OUT_DIR, `${row.newSlug}.mdx`);

    if (oldFilePath !== newFilePath) {
      fs.writeFileSync(oldFilePath, newContent, "utf-8");
      fs.renameSync(oldFilePath, newFilePath);
      renamed++;
      console.log(`✓ ${row.oldSlug} → ${row.newSlug}`);
    } else {
      fs.writeFileSync(newFilePath, newContent, "utf-8");
      skipped++;
      console.log(`  ${row.newSlug} (unchanged)`);
    }

    redirects[oldUrl] = `/blog/${row.newSlug}`;

    if (row.oldSlug !== row.newSlug) {
      const oldPortfolioPath = `/blog/${row.oldSlug}`;
      if (redirects[oldPortfolioPath] && redirects[oldPortfolioPath] !== `/blog/${row.newSlug}`) {
        console.warn(`Conflict: ${oldPortfolioPath} already redirects to ${redirects[oldPortfolioPath]}, not ${row.newSlug}`);
      } else {
        redirects[oldPortfolioPath] = `/blog/${row.newSlug}`;
      }
    }
  }

  fs.writeFileSync(
    path.join(DATA_DIR, "redirects.json"),
    JSON.stringify(redirects, null, 2),
    "utf-8"
  );

  console.log("\nSlug mapping applied:");
  console.log(`  Renamed: ${renamed}`);
  console.log(`  Unchanged: ${skipped}`);
  console.log(`  Not found: ${notFound.length}`);
  console.log(`  Redirect entries: ${Object.keys(redirects).length}`);

  if (notFound.length > 0) {
    console.log("\nCould not find files for:");
    for (const url of notFound.slice(0, 10)) {
      console.log(`  - ${url}`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
