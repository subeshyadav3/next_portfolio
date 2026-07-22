import { codeToHtml } from "shiki";
import { CopyButton } from "./CopyButton";

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
}

function extractCodeAndLang(children: React.ReactNode): { code: string; lang: string } {
  let code = "";
  let lang = "text";

  if (Array.isArray(children)) {
    for (const child of children) {
      if (child && typeof child === "object" && "props" in child) {
        const props = (child as { props?: { className?: string; children?: React.ReactNode } }).props;
        if (props?.className?.includes("language-")) {
          lang = props.className.replace(/.*language-/, "").split(" ")[0] || "text";
        }
        code = extractText(props?.children);
      } else {
        code = extractText(child);
      }
    }
  } else if (children && typeof children === "object" && "props" in children) {
    const props = (children as { props?: { className?: string; children?: React.ReactNode } }).props;
    if (props?.className?.includes("language-")) {
      lang = props.className.replace(/.*language-/, "").split(" ")[0] || "text";
    }
    code = extractText(props?.children);
  } else {
    code = extractText(children);
  }

  return { code: code.trimEnd(), lang };
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

export async function CodeBlock({ children }: CodeBlockProps) {
  const { code, lang } = extractCodeAndLang(children);

  let highlighted = code;
  try {
    highlighted = await codeToHtml(code, {
      lang,
      theme: "github-dark",
    });
  } catch {
    // Fallback to plain text if language isn't supported.
  }

  return (
    <div className="code-block relative group my-8 rounded-xl border border-[var(--blog-border)] bg-[#0d1117] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--blog-border)]/30 bg-[#161b22]">
        <span className="text-xs text-[var(--blog-text-muted)] uppercase tracking-wider">
          {lang}
        </span>
        <CopyButton code={code} />
      </div>
      <div className="overflow-x-auto p-4">
        <div
          className="text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </div>
    </div>
  );
}
