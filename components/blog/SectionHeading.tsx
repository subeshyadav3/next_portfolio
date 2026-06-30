import { slugifyHeading } from "@/lib/blog/mdx";

interface SectionHeadingProps {
  level: 2 | 3;
  children?: React.ReactNode;
}

export function SectionHeading({ level, children }: SectionHeadingProps) {
  const text = extractText(children);
  const id = slugifyHeading(text);
  const Tag = `h${level}` as "h2" | "h3";

  return (
    <Tag
      id={id}
      className="section-heading group scroll-mt-24"
      style={{
        marginTop: "var(--prose-section-gap)",
        marginBottom: "1rem",
        fontWeight: 600,
      }}
    >
      {children}
      <a
        href={`#${id}`}
        className="anchor-link ml-2 text-[var(--blog-text-muted)] no-underline opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`Link to ${text}`}
      >
        #
      </a>
    </Tag>
  );
}

function extractText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }
  if (node && typeof node === "object" && "props" in node) {
    return extractText((node as { props?: { children?: React.ReactNode } }).props?.children);
  }
  return "";
}
