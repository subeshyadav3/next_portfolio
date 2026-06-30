/**
 * Single source of truth for category → slug / label / color / description.
 * Used by blog nav, category badges, progress bar, and category landing pages.
 */

export const CATEGORY_ACCENT_COLORS: Record<string, string> = {
  essays: "var(--cat-essay)",
  poems: "var(--cat-poem)",
  shayari: "var(--cat-shayari)",
  stories: "var(--cat-story)",
  see: "var(--cat-exam)",
  ble: "var(--cat-exam)",
  "class-7": "var(--cat-exam)",
  "class-8": "var(--cat-exam)",
  "class-9": "var(--cat-exam)",
  "class-10": "var(--cat-exam)",
  "class-11": "var(--cat-exam)",
  reviews: "var(--cat-review)",
};

export const CATEGORY_LABELS: Record<string, string> = {
  essays: "Essays",
  poems: "Poems",
  shayari: "Shayari & Gajal",
  stories: "Stories",
  see: "SEE",
  ble: "BLE",
  "class-7": "Class 7",
  "class-8": "Class 8",
  "class-9": "Class 9",
  "class-10": "Class 10",
  "class-11": "Class 11",
  reviews: "Reviews",
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  essays:
    "Nepali essays and nibandha on culture, society, education, and everyday life — written for students, teachers, and anyone learning Nepali.",
  poems:
    "A collection of Nepali poems and kabita, from classic forms to contemporary verses on love, country, nature, and identity.",
  shayari:
    "Nepali shayari, gajal, and short expressive verses — romantic, sad, motivational, and reflective lines to share or save.",
  stories:
    "Nepali short stories and laghukatha that capture moments, morals, and the texture of Nepali life in quick reads.",
  see:
    "SEE practice questions, model sets, and revision notes for Secondary Education Examination preparation.",
  ble:
    "BLE (Basic Level Examination) practice questions and study notes for Class 8 students in Nepal.",
  "class-7":
    "Class 7 study materials, practice questions, and notes covering core subjects for Nepali school curriculum.",
  "class-8":
    "Class 8 study materials, practice questions, and revision notes aligned with the Nepali school curriculum.",
  "class-9":
    "Class 9 practice questions, notes, and study resources to help students prepare for exams.",
  "class-10":
    "Class 10 study notes, practice questions, and revision resources for Nepali high school students.",
  "class-11":
    "Class 11 notes, question answers, and study materials for NEB higher secondary subjects.",
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
  "BLE PRACTICE 2076": "ble",
  "Class 10": "class-10",
  "CLASS 9": "class-9",
  "Class 11": "class-11",
  "class 7": "class-7",
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
  return ["see", "ble", "class-7", "class-8", "class-9", "class-10", "class-11"].includes(slug);
}

export function isPoemCategory(category: string): boolean {
  const slug = getCategorySlug(category);
  return ["poems", "shayari"].includes(slug);
}

export function isPoemCategorySlug(slug: string): boolean {
  return ["poems", "shayari"].includes(slug);
}

export function isNepaliLanguageCategory(category: string): boolean {
  const slug = getCategorySlug(category);
  return [
    "essays",
    "poems",
    "shayari",
    "stories",
    "see",
    "ble",
    "class-7",
    "class-8",
    "class-9",
    "class-10",
    "class-11",
  ].includes(slug);
}

// Internal fallback slugifier for unmapped categories
function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
