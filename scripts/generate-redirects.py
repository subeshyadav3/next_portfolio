#!/usr/bin/env python3
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
BLOGGER_DOMAIN = "https://nepaliessaybook.blogspot.com"


def main():
    with open(DATA_DIR / "old-slugs.json", encoding="utf-8") as f:
        old_slugs = json.load(f)

    # Build oldUrl -> newSlug from CSV
    csv_new_slugs: dict[str, str] = {}
    with open(DATA_DIR / "slug-mapping.csv", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            old_url = f"{BLOGGER_DOMAIN}{row['old_filename']}"
            csv_new_slugs[old_url] = row["new_slug"]

    redirects: dict[str, str] = {}
    missing_in_csv: list[str] = []
    missing_in_content: list[str] = []

    for old_url, old_slug in old_slugs.items():
        new_slug = csv_new_slugs.get(old_url)
        if not new_slug:
            missing_in_csv.append(old_url)
            continue

        # Layer 1: Blogger URL -> new slug
        redirects[old_url] = f"/blog/{new_slug}"

        # Layer 2: old portfolio slug -> new slug (only if changed)
        if old_slug != new_slug:
            old_path = f"/blog/{old_slug}"
            redirects[old_path] = f"/blog/{new_slug}"

    # Report CSV rows that don't have matching content
    for old_url in csv_new_slugs:
        if old_url not in old_slugs:
            missing_in_content.append(old_url)

    (DATA_DIR / "redirects.json").write_text(
        json.dumps(redirects, indent=2), encoding="utf-8"
    )

    print(f"Generated {len(redirects)} redirect entries")
    print(f"  Missing in CSV (content exists but no mapping): {len(missing_in_csv)}")
    print(f"  Missing in content (CSV row but no file): {len(missing_in_content)}")
    if missing_in_csv:
        for url in missing_in_csv[:5]:
            print(f"    {url}")
    if missing_in_content:
        for url in missing_in_content:
            print(f"    {url}")


if __name__ == "__main__":
    main()
