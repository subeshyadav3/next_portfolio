/**
 * Single source of truth for category → slug / label / color / description.
 * Used by blog nav, category badges, progress bar, and category landing pages.
 */

export const CATEGORY_ACCENT_COLORS: Record<string, string> = {
  essays: "var(--cat-essay)",
  poems: "var(--cat-poem)",
  shayari: "var(--cat-shayari)",
  stories: "var(--cat-story)",
  "class-7": "var(--cat-exam)",
  "class-8": "var(--cat-exam)",
  "class-9": "var(--cat-exam)",
  "class-10": "var(--cat-exam)",
  "class-11": "var(--cat-exam)",
  "class-12": "var(--cat-exam)",
  reviews: "var(--cat-review)",
};

export const CATEGORY_LABELS: Record<string, string> = {
  essays: "Essays",
  poems: "Poems",
  shayari: "Shayari & Gajal",
  stories: "Stories",
  "class-7": "Class 7",
  "class-8": "Class 8 - BLE",
  "class-9": "Class 9",
  "class-10": "Class 10 - SEE",
  "class-11": "Class 11",
  "class-12": "Class 12 - NEB",
  reviews: "Reviews",
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  essays:
    "Essays on culture, society, education, and everyday life — mostly in Nepali, with some in English.",
  poems:
    "A collection of poems and kabita — from classic Nepali forms to contemporary verses on love, country, nature, and identity.",
  shayari:
    "Nepali shayari, gajal, and short expressive verses — romantic, sad, motivational, and reflective lines to share or save.",
  stories:
    "Short stories and laghukatha that capture moments, morals, and the texture of life — in Nepali and English.",
  "class-7":
    "Class 7 study materials, practice questions, and notes covering core subjects for Nepali school curriculum.",
  "class-8":
    "BLE (Basic Level Examination) practice questions and study notes for Class 8 students in Nepal.",
  "class-9":
    "Class 9 practice questions, notes, and study resources to help students prepare for exams.",
  "class-10":
    "SEE practice questions, model sets, and revision notes for Secondary Education Examination preparation.",
  "class-11":
    "Class 11 notes, question answers, and study materials for NEB higher secondary subjects.",
  "class-12":
    "Class 12 notes, question answers, and study materials for NEB higher secondary subjects.",
  reviews:
    "Book reviews and recommendations — summaries, takeaways, and critiques of Nepali and world literature.",
};

/**
 * Maps raw Blogger/frontmatter category strings to the canonical clean slugs above.
 * Any category not listed here falls back to slugifying its raw name.
 */
export const CATEGORY_SLUG_MAP: Record<string, string> = {
  "Nepali Essay/Nibandha": "essays",
  "Nepali Poems/Kabita": "poems",
  "Nepali Shayari": "shayari",
  Gajal: "shayari",
  "Nepali Story/Katha": "stories",
  "SEE PRACTICE 2076": "class-10",
  "BLE PRACTICE 2076": "class-8",
  SEE: "class-10",
  BLE: "class-8",
  NEB: "class-12",
  "Class 10": "class-10",
  "CLASS 9": "class-9",
  "Class 9": "class-9",
  "Class 11": "class-11",
  "Class 12": "class-12",
  "class 7": "class-7",
  "Class 7": "class-7",
  "class 8": "class-8",
  "Class 8": "class-8",
  "Book Review": "reviews",
  // Fallback groupings for messy/miscellaneous Blogger categories
  "Nepali Blog": "essays",
  Nepaliblog: "essays",
  FIX: "essays",
  General: "essays",
  nepalisamanyagyan: "essays",
  nepalikitab: "essays",
};

export function getCategorySlug(category: string): string {
  if (!category) return "uncategorized";
  return CATEGORY_SLUG_MAP[category] ?? categorySlug(category);
}

export function getCategoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug] ?? slug;
}

export function getCategoryAccent(slug: string): string {
  return CATEGORY_ACCENT_COLORS[slug] ?? "var(--blog-accent)";
}

export function getCategoryDescription(slug: string): string {
  return CATEGORY_DESCRIPTIONS[slug] ?? `Articles in ${getCategoryLabel(slug)}.`;
}

export function isExamCategory(category: string): boolean {
  const slug = getCategorySlug(category);
  return ["class-7", "class-8", "class-9", "class-10", "class-11", "class-12"].includes(slug);
}

export function isPoemCategory(category: string): boolean {
  const slug = getCategorySlug(category);
  return ["poems", "shayari"].includes(slug);
}

export function isPoemCategorySlug(slug: string): boolean {
  return ["poems", "shayari"].includes(slug);
}

export function isNepaliLanguageCategory(category: string): boolean {
  if (!category) return false;
  const slug = getCategorySlug(category);
  return [
    "essays",
    "poems",
    "shayari",
    "stories",
    "class-7",
    "class-8",
    "class-9",
    "class-10",
    "class-11",
    "class-12",
  ].includes(slug);
}

// Internal fallback slugifier for unmapped categories
function categorySlug(category: string): string {
  if (!category) return "uncategorized";
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
