#!/usr/bin/env python3
"""
Remove inline "Tags:" sections from MDX content and merge those tags into
frontmatter. This keeps tags available for SEO metadata keywords without
rendering a low-quality keyword block inside the article body.
"""

import re
from pathlib import Path

POSTS_DIR = Path(__file__).resolve().parent.parent / "content" / "blog"
TAG_HEADER_PATTERN = re.compile(r"\*\*Tags:\*\*", re.IGNORECASE)


def parse_inline_tags(section: str) -> list[str]:
    """Extract tag strings from a 'Tags:' markdown list section."""
    tags: list[str] = []
    # Numbered or plain list items, comma-separated, or line breaks
    lines = re.split(r"\n+", section.strip())
    for line in lines:
        line = line.strip()
        if not line:
            continue
        # Remove leading numbering like "1.", "2)", "•"
        line = re.sub(r"^(\d+[\.\)]\s*|[•\-\*]\s*)", "", line)
        # Split on commas
        for part in line.split(","):
            tag = part.strip()
            tag = re.sub(r"\s+", " ", tag)
            if tag and len(tag) > 1:
                tags.append(tag)
    return tags


def slugify_tag(tag: str) -> str:
    return re.sub(r"[^a-z0-9\-]", "-", tag.lower()).strip("-")


def cleanup_file(file: Path) -> tuple[list[str], bool]:
    content = file.read_text(encoding="utf-8")

    if "---" not in content:
        return [], False

    # Split frontmatter and body
    _, rest = content.split("---", 1)
    if "---" not in rest:
        return [], False
    frontmatter, body = rest.split("---", 1)

    match = TAG_HEADER_PATTERN.search(body)
    if not match:
        return [], False

    start = match.start()
    # Tags section usually goes to end of content, but stop at next major heading if any
    remaining = body[start:]
    next_heading = re.search(r"\n#{1,6}\s", remaining[1:])
    if next_heading:
        section = remaining[: next_heading.start() + 1]
        after = remaining[next_heading.start() + 1 :]
    else:
        section = remaining
        after = ""

    raw_tags = parse_inline_tags(section)

    # Clean up body: remove the tags section
    new_body = body[:start] + after
    new_body = re.sub(r"\n{3,}", "\n\n", new_body)

    # Read existing frontmatter tags
    existing_tags: list[str] = []
    tag_match = re.search(r"^tags:\s*$\n((?:\s+-\s+.+\n?)+)", frontmatter, re.MULTILINE)
    if tag_match:
        existing_tags = [
            line.strip().lstrip("-").strip().strip('"')
            for line in tag_match.group(1).strip().split("\n")
            if line.strip()
        ]

    existing_slugs = {slugify_tag(t) for t in existing_tags}
    merged = list(existing_tags)
    for tag in raw_tags:
        slug = slugify_tag(tag)
        if slug and slug not in existing_slugs:
            merged.append(tag)
            existing_slugs.add(slug)

    # Rebuild frontmatter tags block
    if merged:
        tags_yaml = "tags:\n" + "\n".join(f'  - "{tag}"' for tag in merged)
    else:
        tags_yaml = "tags: []"

    if tag_match:
        new_frontmatter = re.sub(
            r"^tags:\s*$\n(?:\s+-\s+.+\n?)+",
            tags_yaml,
            frontmatter,
            flags=re.MULTILINE,
        )
    else:
        new_frontmatter = frontmatter.rstrip() + "\n" + tags_yaml + "\n"

    new_content = f"---{new_frontmatter}---{new_body}"
    file.write_text(new_content, encoding="utf-8")

    return raw_tags, True


def main():
    total_files = 0
    cleaned_files = 0
    all_extracted_tags: dict[str, list[str]] = {}

    for file in sorted(POSTS_DIR.glob("*.mdx")):
        total_files += 1
        tags, changed = cleanup_file(file)
        if changed:
            cleaned_files += 1
            all_extracted_tags[file.name] = tags

    print(f"Processed {total_files} files")
    print(f"Cleaned inline tags from {cleaned_files} files")
    if all_extracted_tags:
        print("\nExtracted tags sample:")
        for name, tags in list(all_extracted_tags.items())[:5]:
            print(f"  {name}: {len(tags)} tags")


if __name__ == "__main__":
    main()
