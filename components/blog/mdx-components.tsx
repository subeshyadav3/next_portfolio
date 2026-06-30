import {
  isExamCategory,
  isPoemCategory,
  getCategoryAccent,
  getCategorySlug,
} from "@/lib/blog/categories";
import { PoemLine } from "./PoemLine";
import { ProseParagraph } from "./ProseParagraph";
import { PullQuote } from "./PullQuote";
import { CaptionedImage } from "./CaptionedImage";
import { SectionHeading } from "./SectionHeading";
import { CodeBlock } from "./CodeBlock";
import { ResponsiveTable } from "./ResponsiveTable";

export function mdxComponents(category: string) {
  const isPoem = isPoemCategory(category);
  const accent = getCategoryAccent(getCategorySlug(category));

  return {
    p: (props: { children?: React.ReactNode }) =>
      isPoem ? <PoemLine {...props} /> : <ProseParagraph {...props} />,
    blockquote: (props: { children?: React.ReactNode }) => (
      <PullQuote {...props} color={accent} />
    ),
    img: (props: { src?: string; alt?: string; title?: string }) => (
      <CaptionedImage {...props} />
    ),
    h2: (props: { children?: React.ReactNode }) => (
      <SectionHeading level={2} {...props} />
    ),
    h3: (props: { children?: React.ReactNode }) => (
      <SectionHeading level={3} {...props} />
    ),
    pre: (props: { children?: React.ReactNode; className?: string }) => (
      <CodeBlock {...props} />
    ),
    table: (props: { children?: React.ReactNode }) => (
      <ResponsiveTable {...props} />
    ),
  };
}


