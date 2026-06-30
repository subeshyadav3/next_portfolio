#!/usr/bin/env python3
import csv
import os
import re
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "data" / "slug-mapping.csv"
OUT_DIR = ROOT / "content" / "blog"
DATA_DIR = ROOT / "data"
BLOGGER_DOMAIN = "https://nepaliessaybook.blogspot.com"


def find_file_by_old_url(out_dir: Path, target_old_url: str) -> str | None:
    if not out_dir.exists():
        return None
    for file in out_dir.iterdir():
        if not file.is_file() or file.suffix != ".mdx":
            continue
        content = file.read_text(encoding="utf-8")
        match = re.search(r'^oldUrl:\s*"?([^"\n]+)"?', content, re.MULTILINE)
        if match and match.group(1).strip() == target_old_url:
            return file.name
    return None


def update_frontmatter_slug(content: str, new_slug: str) -> str:
    return re.sub(
        r'^slug:\s*"?[^"\n]+"?',
        f'slug: "{new_slug}"',
        content,
        count=1,
        flags=re.MULTILINE,
    )


def main():
    rows = []
    with open(CSV_PATH, "r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)

    print(f"Loaded {len(rows)} slug mapping rows")

    redirects: dict[str, str] = {}
    renamed = 0
    skipped = 0
    not_found: list[str] = []

    for row in rows:
        old_filename = row["old_filename"]
        old_slug = row["old_slug"]
        new_slug = row["new_slug"]
        old_url = f"{BLOGGER_DOMAIN}{old_filename}"

        current_file = find_file_by_old_url(OUT_DIR, old_url)
        if not current_file:
            not_found.append(old_url)
            continue

        old_path = OUT_DIR / current_file
        content = old_path.read_text(encoding="utf-8")
        new_content = update_frontmatter_slug(content, new_slug)
        new_path = OUT_DIR / f"{new_slug}.mdx"

        if old_path != new_path:
            old_path.write_text(new_content, encoding="utf-8")
            old_path.rename(new_path)
            renamed += 1
            print(f"✓ {old_slug} → {new_slug}")
        else:
            new_path.write_text(new_content, encoding="utf-8")
            skipped += 1
            print(f"  {new_slug} (unchanged)")

        redirects[old_url] = f"/blog/{new_slug}"

        if old_slug != new_slug:
            old_portfolio_path = f"/blog/{old_slug}"
            if (
                old_portfolio_path in redirects
                and redirects[old_portfolio_path] != f"/blog/{new_slug}"
            ):
                print(
                    f"Conflict: {old_portfolio_path} already redirects to "
                    f"{redirects[old_portfolio_path]}, not /blog/{new_slug}"
                )
            else:
                redirects[old_portfolio_path] = f"/blog/{new_slug}"

    (DATA_DIR / "redirects.json").write_text(
        json.dumps(redirects, indent=2), encoding="utf-8"
    )

    print("\nSlug mapping applied:")
    print(f"  Renamed: {renamed}")
    print(f"  Unchanged: {skipped}")
    print(f"  Not found: {len(not_found)}")
    print(f"  Redirect entries: {len(redirects)}")

    if not_found:
        print("\nCould not find files for:")
        for url in not_found[:10]:
            print(f"  - {url}")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
