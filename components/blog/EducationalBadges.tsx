import type { NormalizedPost } from "@/lib/content/types";

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
  EASY: { bg: "#22c55e", text: "#fff" },
  MEDIUM: { bg: "#eab308", text: "#000" },
  HARD: { bg: "#ef4444", text: "#fff" },
};

const CLASS_LEVEL_LABELS: Record<string, string> = {
  "class-1": "Class 1",
  "class-2": "Class 2",
  "class-3": "Class 3",
  "class-4": "Class 4",
  "class-5": "Class 5",
  "class-6": "Class 6",
  "class-7": "Class 7",
  "class-8": "Class 8",
  "class-9": "Class 9",
  "class-10": "Class 10",
  "class-11": "Class 11",
  "class-12": "Class 12",
};

function labelFromSlug(slug: string): string {
  return CLASS_LEVEL_LABELS[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const EXAM_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  SEE: { bg: "#6366f1", text: "#fff" },
  BLE: { bg: "#8b5cf6", text: "#fff" },
  NEB: { bg: "#06b6d4", text: "#fff" },
  IOE: { bg: "#f97316", text: "#fff" },
  CEEC: { bg: "#ec4899", text: "#fff" },
  OTHER: { bg: "#6b7280", text: "#fff" },
};

interface Props {
  post: NormalizedPost;
}

export default function EducationalBadges({ post }: Props) {
  const tags: { label: string; color?: { bg: string; text: string } }[] = [];

  if (post.language === "ne") {
    tags.push({ label: "नेपाली", color: { bg: "#78716c", text: "#fff" } });
  }

  if (post.examType) {
    const color = EXAM_TYPE_COLORS[post.examType];
    if (color) tags.push({ label: post.examType, color });
  }

  if (post.board) {
    tags.push({ label: post.board });
  }

  if (post.classLevel) {
    tags.push({ label: labelFromSlug(post.classLevel) });
  }

  if (post.subject) {
    tags.push({ label: post.subject });
  }

  if (post.difficulty) {
    const color = DIFFICULTY_COLORS[post.difficulty];
    if (color) tags.push({ label: post.difficulty.charAt(0) + post.difficulty.slice(1).toLowerCase(), color });
  }

  if (post.series) {
    tags.push({ label: post.series });
  }

  if (tags.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
      {tags.map((tag) => (
        <span
          key={tag.label}
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={
            tag.color
              ? { backgroundColor: tag.color.bg, color: tag.color.text }
              : {
                  backgroundColor: "var(--blog-surface)",
                  color: "var(--blog-text-secondary)",
                  border: "1px solid var(--blog-border)",
                }
          }
        >
          {tag.label}
        </span>
      ))}
    </div>
  );
}
