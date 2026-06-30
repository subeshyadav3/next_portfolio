export interface QAPair {
  question: string;
  answer: string;
}

/**
 * Extracts question/answer pairs from exam-notes style content.
 *
 * Supports patterns like:
 *   ### What is ...?
 *   Answer text here.
 *
 *   1. What is ...?
 *   Answer text here.
 *
 * Returns an empty array when the content does not follow a clean Q&A
 * structure so callers can skip generating FAQ schema.
 */
export function extractQAPairs(content: string): QAPair[] {
  const pairs: QAPair[] = [];

  // Pattern A: heading-style questions (### Question text)
  const headingPattern = /^(#{3,4})\s+(.*?)\n+([\s\S]*?)(?=\n#{3,4}\s+|\n#{1,2}\s+|$)/gm;
  let match;
  while ((match = headingPattern.exec(content)) !== null) {
    const question = cleanText(match[2]);
    const answer = cleanText(match[3]);
    if (isValidPair(question, answer)) {
      pairs.push({ question, answer });
    }
  }

  // If heading pattern found clean pairs, use those.
  if (pairs.length > 0) {
    return pairs;
  }

  // Pattern B: numbered questions (1. Question text? followed by answer paragraph)
  const numberedPattern = /^(\d+)\.\s+(.*?)(?:\?|।|\.)\n+([\s\S]*?)(?=\n\d+\.\s+|\n#{1,4}\s+|$)/gm;
  while ((match = numberedPattern.exec(content)) !== null) {
    const question = cleanText(match[2]) + (match[0].includes("?") ? "" : "?");
    const answer = cleanText(match[3]);
    if (isValidPair(question, answer)) {
      pairs.push({ question, answer });
    }
  }

  return pairs;
}

function cleanText(text: string): string {
  return text
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function isValidPair(question: string, answer: string): boolean {
  const minQuestionLen = 10;
  const minAnswerLen = 5;
  return (
    question.length >= minQuestionLen &&
    answer.length >= minAnswerLen &&
    !answer.startsWith("http")
  );
}
