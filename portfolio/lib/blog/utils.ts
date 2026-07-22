import { format, parseISO } from "date-fns";

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  try {
    return format(parseISO(dateString), "MMMM d, yyyy");
  } catch {
    return dateString;
  }
}

export function formatDateISO(dateString: string): string {
  if (!dateString) return "";
  try {
    return parseISO(dateString).toISOString();
  } catch {
    return dateString;
  }
}

export function getYear(dateString: string): string {
  if (!dateString) return "";
  try {
    return format(parseISO(dateString), "yyyy");
  } catch {
    return "";
  }
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function generateExcerpt(content: string, maxLength = 160): string {
  const text = stripHtml(content);
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength).trim();
  return truncated.endsWith(".") ? truncated : `${truncated}...`;
}

export function countWords(text: string): number {
  const devanagariWords = text.match(/[\u0900-\u097F]+/g) || [];
  const latinWords = text.replace(/[\u0900-\u097F]/g, "").match(/\b\w+\b/g) || [];
  return devanagariWords.length + latinWords.length;
}

export function calculateReadingTime(content: string): number {
  const text = stripHtml(content);
  const words = countWords(text);
  return Math.max(1, Math.ceil(words / 150));
}

export function isDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}
