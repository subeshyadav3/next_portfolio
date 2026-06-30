#!/usr/bin/env python3
"""
Remove any inline "Tags:" or "Keywords:" sections from MDX post bodies.
These are Blogger SEO keyword dumps that should not be rendered.
"""

import re
from pathlib import Path

POSTS_DIR = Path(__file__).resolve().parent.parent / "content" / "blog"

HEADERS = [
    r"\*\*Tags:\*\*",
    r"\*\*Tags\*\*",
    r"Tags:",
    r"\*\*Keywords:\*\*",
    r"\*\*Keywords\*\*",
    r"Keywords:",
    r"Related Keywords",
    r"Related Tags",
    r"Search Tags",
    r"Search Keywords",
]

SECTION_START = re.compile(
    r"\n\s*(?:" + "|".join(HEADERS) + r")\s*\n",
    re.IGNORECASE,
)


def remove_body_keyword_sections(content: str) -> tuple[str, bool]:
    if "---" not in content:
        return content, False

    parts = content.split("---", 2)
    if len(parts) < 3:
        return content, False

    frontmatter = parts[1]
    body = "---" + parts[2]

    changed = False
    while True:
        match = SECTION_START.search(body)
        if not match:
            break

        start = match.start()
        section = body[start:]
        # Stop at next major heading or end of file
        next_break = re.search(r"\n#{1,6}\s", section[1:])
        if next_break:
            end = start + 1 + next_break.start()
        else:
            end = len(body)

        body = body[:start] + body[end:]
        changed = True

    if not changed:
        return content, False

    body = re.sub(r"\n{3,}", "\n\n", body)
    return f"---{frontmatter}{body}", True


def main():
    cleaned = 0
    for file in sorted(POSTS_DIR.glob("*.mdx")):
        content = file.read_text(encoding="utf-8")
        new_content, changed = remove_body_keyword_sections(content)
        if changed:
            file.write_text(new_content, encoding="utf-8")
            cleaned += 1
            print(f"Cleaned: {file.name}")

    print(f"\nCleaned {cleaned} files")


if __name__ == "__main__":
    main()
