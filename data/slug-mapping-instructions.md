# Slug Migration — Ready-to-Apply Mapping

This replaces the "figure out the slug fix yourself" instruction in Part 1b of the detailed prompt. The mapping is already generated from your actual Blogger export (`feed.atom`, 146 live posts) — the agent just needs to apply it, not invent it.

## What's in `slug-mapping.csv`

Columns: `title`, `category`, `old_filename` (the original Blogger path, e.g. `/2018/12/nepali-new-story.html`), `old_slug` (current filename in `content/blog/`, pre-fix), `new_slug` (the SEO-friendly replacement), `is_bad_old` (`True` for the 34 posts that currently have a meaningless `blog-post`/`blog-pos` fallback slug), `published` (original publish date).

## How the new slugs were generated

For titles that already had a substantial English phrase (2+ words, no Devanagari) — e.g. "Essay on Children Day in Nepali" — that English phrase was used directly as the slug source, since it's already keyword-rich and matches what people actually search.

For titles that are pure or mostly Devanagari — e.g. "बालदिवस निबन्ध" — the title was transliterated to readable Latin script (so `बालदिवस निबन्ध` → `baladivasa-nibandha`) rather than stripped to nothing, which is what was happening before and is why you got `blog-post_36.mdx` as a filename. This uses standard phonetic transliteration, not arbitrary romanization, so the slugs are still pronounceable/recognizable to Nepali readers searching in Latin script.

Slugs are capped around 60 characters at a word boundary — long enough to carry keywords, short enough not to get truncated in search results or look spammy.

All 146 new slugs are confirmed unique — no collisions.

## What the agent should do with this file

1. Copy `slug-mapping.csv` into the repo, e.g. `data/slug-mapping.csv`.
2. Write a one-time migration script `scripts/apply-slug-mapping.ts` that: reads the CSV, for each row finds the matching MDX file in `content/blog/` by `old_slug` (matching against current filename, not `old_filename` — that's the original Blogger path, already consumed), renames the file to `new_slug.mdx`, and updates the `slug:` field in that file's frontmatter to match.
3. Re-run (or update) `data/redirects.json` generation so it includes three layers, not two: original Blogger URL (`old_filename`) → final `new_slug`, AND for any post where the current site might already be live/indexed under the bad `old_slug` (the `blog-post*` ones), add `old_slug` → `new_slug` as a second redirect. Check both — don't assume the bad slugs were never indexed.
4. Spot-check 5–10 entries manually after the script runs: confirm the file renamed correctly, frontmatter `slug` field matches the filename, and the post still builds and loads.
5. Do not re-run this migration a second time after it's applied — pick the final slugs once from this file and lock them in, consistent with the "do this exactly once" guidance in Part 1b.

This file should be treated as the source of truth for the rename — the agent shouldn't re-derive slugs from titles independently, since that risks producing different results than what's in this CSV and creating drift between what you reviewed and what got shipped.
